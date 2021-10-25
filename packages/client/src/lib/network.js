import defaultVars from '../../../../default-vars'
import config from '../config';

function getServerConfigUrl() {
  const serverConfigUrl = `${window.location.protocol}//${window.location.host}/${defaultVars.configFile}`;
  return serverConfigUrl;
}

function getApiServerEndPoint() {
  return config.apiServerEndPoint;
}

function setApiServerEndPoint(json) {
  const { hostname } = window.location;
  const apiServerPort = json['api-server']?.port || defaultVars.apiServerPort;
  config.apiServerEndPoint = `http://${hostname}:${apiServerPort}`;
}

function getDownloadServerUrl() {
  return config.downloadServerUrl;
}

function getDownloadFileUrl(file) {
  const url = `${getDownloadServerUrl()}/${file}`;
  return url;
}

function setDownloadServerUrl(json) {
  const { hostname } = window.location;
  const downloadServerPort = json['download-server']?.port || defaultVars.downloadServerPort;
  config.downloadServerUrl = `http://${hostname}:${downloadServerPort}`;
}

export { getApiServerEndPoint, setApiServerEndPoint, getDownloadFileUrl, setDownloadServerUrl, getServerConfigUrl };
