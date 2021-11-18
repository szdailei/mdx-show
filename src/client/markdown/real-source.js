import defaultVars from '../default-vars.js';

const realSrcVars = {
  downloadServerUrl: undefined,
};

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
      serverSrc = `${realSrcVars.downloadServerUrl}/${getImagesDir()}${src}`;
      break;
    case 'video':
      serverSrc = `${realSrcVars.downloadServerUrl}/${getVideosDir()}${src}`;
      break;
    default:
      break;
  }
  return serverSrc;
}

function isFileUrl() {
  return window.location.protocol === 'file:';
}

const realSrc = (src, type) => {
  if (isUrl(src)) return src;
  const source = isFileUrl() ? convertSrcToLocal(src, type) : convertSrcToServer(src, type);
  return source;
};

function getDownloadServerPort(staticServerPort) {
  const port = typeof staticServerPort === 'string' ? parseInt(staticServerPort, 10) : staticServerPort;
  return port + 2;
}

realSrc.init = () => {
  const { protocol, hostname, port } = window.location;

  const downloadServerPort = getDownloadServerPort(port);
  const downloadServerUrl = `${protocol}//${hostname}:${downloadServerPort}`;
  realSrcVars.downloadServerUrl = downloadServerUrl;
};

export default realSrc;

export { isFileUrl };
