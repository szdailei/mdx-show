import { getApiServerPort, getDownloadServerPort } from '../../../../default-vars.js';
import config from '../config.js';

function getApiServerEndPoint() {
  return config.apiServerEndPoint;
}

function setApiServerEndPoint() {
  const { protocol, hostname, port } = window.location;
  const apiServerPort = getApiServerPort(port);
  config.apiServerEndPoint = `${protocol}//${hostname}:${apiServerPort}`;
}

function getDownloadServerUrl() {
  return config.downloadServerUrl;
}

function getDownloadFileUrl(file) {
  const url = `${getDownloadServerUrl()}/${file}`;
  return url;
}

function setDownloadServerUrl() {
  const { protocol, hostname, port } = window.location;
  const downloadServerPort = getDownloadServerPort(port);
  config.downloadServerUrl = `${protocol}//${hostname}:${downloadServerPort}`;
}

export { getApiServerEndPoint, setApiServerEndPoint, getDownloadFileUrl, setDownloadServerUrl };
