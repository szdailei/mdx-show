import globalVars from './global-vars.js';
import { getApiServerPort, getApiServerPath, getDownloadServerPort } from '../api-server-vars.js';

function setServerEndPoint(apiServerEndPoint) {
  globalVars.apiServerEndPoint = apiServerEndPoint;
}

function setDownloadServerUrl(downloadServerUrl) {
  globalVars.downloadServerUrl = downloadServerUrl;
}

const init = () => {
  const { protocol, hostname, port } = window.location;
  const apiServerPort = getApiServerPort(port);
  const apiServerPath = getApiServerPath();
  const apiServerEndPoint = `${protocol}//${hostname}:${apiServerPort}${apiServerPath}`;

  setServerEndPoint(apiServerEndPoint);

  const downloadServerPort = getDownloadServerPort(port);
  const downloadServerUrl = `${protocol}//${hostname}:${downloadServerPort}`;
  setDownloadServerUrl(downloadServerUrl);
};

// eslint-disable-next-line no-unneeded-ternary
init.finished = () => globalVars.apiServerEndPoint ? true : false;

export default init;
