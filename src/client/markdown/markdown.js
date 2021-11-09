import defaultVars from '../default-vars.js';
import request from '../network/client.js';

function isUrl(src) {
  try {
    // eslint-disable-next-line no-unused-vars
    const url = new URL(src);
  } catch (err) {
    return false;
  }
  return true;
}

function getImagesDir() {
  return defaultVars.imagesDir;
}

function getVideosDir() {
  return defaultVars.videosDir;
}

function getLocalImagesUrl() {
  return `file:${getImagesDir()}`;
}

function getLocalVideosUrl() {
  return `file:${getVideosDir()}`;
}

function convertSrcToLocal(src, type) {
  let localSrc;
  switch (type) {
    case 'img':
      localSrc = `${getLocalImagesUrl()}${src}`;
      break;
    case 'video':
      localSrc = `${getLocalVideosUrl()}${src}`;
      break;
    default:
      break;
  }
  return localSrc;
}

function convertSrcToServer(src, type) {
  let serverSrc;
  switch (type) {
    case 'img':
      serverSrc = `${request.getDownloadServerUrl()}/${getImagesDir()}${src}`;
      break;
    case 'video':
      serverSrc = `${request.getDownloadServerUrl()}/${getVideosDir()}${src}`;
      break;
    default:
      break;
  }
  return serverSrc;
}

function getRealSrc(src, type) {
  if (isUrl(src)) return src;
  const realSrc = window.location.protocol === 'file:' ? convertSrcToLocal(src, type) : convertSrcToServer(src, type);
  return realSrc;
}

function removeBlankLine(text) {
  let result = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== '\r' && text[i] !== '\n') {
      result += text[i];
    }
  }
  return result;
}

function trim(text) {
  if (text) {
    return text.trim();
  }
  return text;
}

export { getRealSrc, removeBlankLine, trim };
