import fs from 'fs';
import { join, extname } from 'path';
import zlib from 'zlib';
import { Transform } from 'stream';
import LRU from 'quick-lru';
import mime from 'mime';
import { sendResponse, notFound, forbidden } from '../http/response.js';
import hasRight from '../security/has-right.js';
import startServer from '../http/start-server.js';

const MAX_CACHED_FILES = 50;
const MAX_CACHED_SIZE = 10 * 1024 * 1024;
const MIN_COMPRESS_SIZE = 2048;
const MIN_BR_COMPRESS_SIZE = 5 * 1024 * 1024;
const lru = new LRU({ maxSize: MAX_CACHED_FILES });

function isCompressType(mimeType) {
  const types = mimeType.split('/');
  const type = types[0];
  if (type === 'application' || type === 'text') {
    return true;
  }
  return false;
}

function getContentType(filename) {
  const extension = extname(filename);
  let mimeType;
  if (extension) {
    mimeType = mime.getType(extension);
    if (mimeType) {
      const contentType = `${mimeType}; charset=utf-8`;
      return contentType;
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
  if (size < MIN_COMPRESS_SIZE || !isCompressType(mimeType) || encodings.size === 0) {
    return '';
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
Object.setPrototypeOf(NonCompressTransform.prototype, Transform.prototype);
Object.setPrototypeOf(NonCompressTransform, Transform);

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

function createEtag(mtimeStr, { encoding }) {
  return `${encoding}:${mtimeStr}`;
}

function getCache(filename, { etag, encoding }) {
  const value = lru.get(filename);
  if (!value) {
    return null;
  }
  if (value.etag !== etag || value.encoding !== encoding) {
    lru.delete(filename);
    return null;
  }

  value.data.length = value.length;
  return value.data;
}

function setCache(filename, data, { etag, length, encoding }) {
  const value = { data, etag, length, encoding };
  lru.set(filename, value);
}

/**
@require res.headersSent is false
*/
function sendFile(res, { fileName, etag, mimeType, encoding }) {
  res.setHeader('ETag', etag);
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Encoding', encoding);

  const cache = getCache(fileName, { etag, encoding });
  if (cache) {
    sendResponse(res, 200, cache.data);
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
          setCache(fileName, dataBuffer, { etag, length: dataBufferLength, encoding });
        }
      });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function resolveUrl(req, res, { method, url }, options) {
  const { root } = options;
  const path = join(root, decodeURI(url));
  if (method !== 'GET' || !hasRight({ path, root })) {
    forbidden(res);
    return;
  }

  let stats;
  try {
    stats = await fs.promises.stat(path);
  } catch (error) {
    notFound(res);
    return;
  }

  if (res.headersSent) {
    res.end();
    return;
  }
  if (stats.isFile()) {
    const mimeType = getContentType(path);
    const encoding = getContentEncoding(req.headers['accept-encoding'], stats.size, mimeType);
    const etag = createEtag(stats.mtimeMs.toString(), { encoding });
    if (req.headers['if-none-match'] === etag) {
      sendResponse(res, 304);
    } else {
      sendFile(res, { fileName: path, etag, mimeType, encoding });
    }
    return;
  }

  if (stats.isDirectory()) {
    resolveUrl(req, res, { method, url: join(url, 'index.html') }, options);
    return;
  }
  notFound(res);
}

function staticServer(port, options) {
  const server = startServer(port, options, resolveUrl);
  return server;
}

export default staticServer;
