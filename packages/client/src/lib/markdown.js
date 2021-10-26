import {defaultVars} from '../../../../default-vars'
import { getDownloadFileUrl } from './network';

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
      serverSrc = getDownloadFileUrl(`${getImagesDir()}${src}`);
      break;
    case 'video':
      serverSrc = getDownloadFileUrl(`${getVideosDir()}${src}`);
      break;
    default:
      break;
  }
  return serverSrc;
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

export { convertSrcToLocal, convertSrcToServer, removeBlankLine, trim };
