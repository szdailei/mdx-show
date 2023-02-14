/* eslint-disable no-bitwise */
import fs from 'fs';
import { join, extname } from 'path';
import zlib from 'zlib';
import { Transform } from 'stream';
import LRU from 'quick-lru';
import mime from 'mime/lite';
import { sendResponse, notFound, forbidden } from '../http';

const MAX_CACHED_FILES = 50;
const MAX_CACHED_SIZE = 10 * 1024 * 1024;
const MIN_BR_COMPRESS_SIZE = 5 * 1024 * 1024;
const lru = new LRU({ maxSize: MAX_CACHED_FILES });

function isCompressible(mimeType) {
  const types = mimeType.split('/');
  if (types[0] === 'text') return true;

  switch (types[1]) {
    case 'text':
    case 'javascript':
      return true;
    default: {
      const fields = types[1].split('+');
      if (fields.length === 2) {
        switch (fields[1]) {
          case 'text':
          case 'json':
          case 'json5':
          case 'xml':
          case 'msword':
            return true;
          default:
            return false;
        }
      }
      return false;
    }
  }
}

function getMimeType(filename) {
  const extension = extname(filename);
  let mimeType;
  if (extension) {
    mimeType = mime.getType(extension);
    if (mimeType) {
      return mimeType;
    }
  }
  return 'application/octet-stream';
}

function getEncodings(acceptEncoding) {
  const encodings = new Set();
  if (!acceptEncoding || acceptEncoding.indexOf('*') !== -1) {
    encodings.add('*');
  } else {
    if (acceptEncoding.indexOf('br') !== -1) {
      encodings.add('br');
    }
    if (acceptEncoding.indexOf('deflate') !== -1) {
      encodings.add('deflate');
    }
    if (acceptEncoding.indexOf('gzip') !== -1) {
      encodings.add('gzip');
    }
  }
  return encodings;
}

function getContentEncoding(acceptEncoding, size, mimeType) {
  const encodings = getEncodings(acceptEncoding);
  if (!isCompressible(mimeType) || encodings.size === 0) {
    return null;
  }
  // Speed: deflate = gzip >> br. Compress: br > deflate = gzip. So use br for big files, deflate for others
  if (size > MIN_BR_COMPRESS_SIZE) {
    if (encodings.has('br') || encodings.has('*')) {
      return 'br';
    }
  }
  if (encodings.has('deflate') || encodings.has('*')) {
    return 'deflate';
  }
  if (encodings.has('gzip')) {
    return 'gzip';
  }
  return '';
}

function NonCompressTransform(options) {
  Transform.call(this, { autoDestroy: true, ...options });
}
// eslint-disable-next-line no-underscore-dangle
NonCompressTransform.prototype._transform = (chunk, _, callback) => {
  callback(null, chunk);
};
Object.setPrototypeOf(NonCompressTransform, Transform);
Object.setPrototypeOf(NonCompressTransform.prototype, Transform.prototype);

function createTransform(encoding) {
  switch (encoding) {
    case 'br':
      return zlib.createBrotliCompress();
    case 'gzip':
      return zlib.createGzip();
    case 'deflate':
      return zlib.createDeflate();
    default:
      return new NonCompressTransform();
  }
}

function makeCRCTable() {
  let crc;
  const crcTable = [];
  for (let i = 0; i < 256; i += 1) {
    crc = i;
    for (let j = 0; j < 8; j += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    crcTable[i] = crc;
  }
  return crcTable;
}

function crc32(str) {
  let crc = 0 ^ -1;

  for (let i = 0; i < str.length; i += 1) {
    crc = (crc >>> 8) ^ makeCRCTable()[(crc ^ str.charCodeAt(i)) & 0xff];
  }

  return (crc ^ -1) >>> 0;
}

function createEtag(url, mtime) {
  return crc32(`${url}:${mtime}`).toString();
}

function getCachedDataBuffer(fileName, { etag, encoding }) {
  const value = lru.get(fileName);
  if (!value) {
    return null;
  }
  if (value.etag !== etag || value.encoding !== encoding) {
    lru.delete(fileName);
    return null;
  }

  return value.data;
}

function setCache(fileName, data, { etag, mimeType, encoding }) {
  const value = { data, etag, mimeType, encoding };
  lru.set(fileName, value);
}

/**
@require res.headersSent is false
*/
function sendFile(res, { fileName, etag, mimeType, encoding }) {
  res.setHeader('ETag', etag);
  res.setHeader('Content-Type', `${mimeType}; charset=UTF-8`);
  if (encoding) {
    res.setHeader('Content-Encoding', encoding);
  }

  const cachedDataBuffer = getCachedDataBuffer(fileName, { etag, encoding });
  if (cachedDataBuffer) {
    sendResponse(res, 200, cachedDataBuffer);
    return;
  }

  const transform = createTransform(encoding);
  const dataArray = [];
  transform.on('data', (data) => {
    dataArray.push(data);
  });

  res.writeHead(200);
  try {
    fs.createReadStream(fileName)
      .pipe(transform)
      .pipe(res)
      .on('finish', () => {
        let dataBufferLength = 0;
        for (let i = 0; i < dataArray.length; i += 1) {
          dataBufferLength += dataArray[i].length;
        }
        const dataBuffer = Buffer.concat(dataArray, dataBufferLength);
        if (dataBufferLength < MAX_CACHED_SIZE) {
          setCache(fileName, dataBuffer, { etag, mimeType, encoding });
        }
      });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function staticServer(req, res, options) {
  const { url, path } = options;

  if (req.method !== 'GET') {
    forbidden(res);
    return;
  }

  let stats;
  try {
    stats = await fs.promises.stat(path);
  } catch (error) {
    notFound(res, url);
    return;
  }

  if (res.headersSent) {
    res.end();
    return;
  }

  if (stats.isFile()) {
    const mimeType = getMimeType(path);
    const encoding = getContentEncoding(req.headers['accept-encoding'], stats.size, mimeType);
    const etag = createEtag(url, stats.mtimeMs.toString());
    if (req.headers['if-none-match'] === etag) {
      sendResponse(res, 304);
    } else {
      sendFile(res, { fileName: path, etag, mimeType, encoding });
    }
    return;
  }

  if (stats.isDirectory()) {
    staticServer(req, res, { url, path: join(path, 'index.html') });
    return;
  }

  notFound(res, url);
}

export default staticServer;
