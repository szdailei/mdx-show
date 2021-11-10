import { getApiServerPort, getApiServerPath, getDownloadServerPort } from '../../api-server-vars.js';

const clientVars = {
  apiServerEndPoint: undefined,
  downloadServerUrl: undefined,
};

async function createErrorByRes(res) {
  const resBody = await res.text();
  return new Error(`${res.status}: ${res.statusText}: ${resBody}`);
}

function createErrorByResult(result) {
  let msg = '';
  result.errors.forEach((resultError) => {
    let locationsMsg = '';
    resultError.locations.forEach((location) => {
      locationsMsg += `line:${location.line} column:${location.column}`;
    });
    msg += `${locationsMsg} ${resultError.message}\n`;
  });

  return new Error(msg);
}

async function parseResBody(res, resType) {
  switch (resType) {
    case 'text':
      return res.text();
    case 'json': {
      return res.json();
    }
    default:
      return null;
  }
}

const request = async (body) => {
  const resType = 'json';
  const endPoint = clientVars.apiServerEndPoint;
  const options = {
    method: 'POST',
    mode: 'cors',
    body: body ? JSON.stringify(body) : null,
  };

  let data;
  let error;
  try {
    const res = await fetch(endPoint, options);
    if (!res.ok) {
      const resNotOkError = await createErrorByRes(res);
      return { data, error: resNotOkError };
    }

    const serverResult = await parseResBody(res, resType);
    if (!serverResult) error = new Error('resType wrong or response body format wrong');
    if (serverResult.errors) error = createErrorByResult(serverResult);

    data = serverResult.data || serverResult;
  } catch (httpError) {
    error = httpError;
  }

  return { data, error };
};

request.getDownloadServerUrl = () => clientVars.downloadServerUrl;

request.init = () => {
  const { protocol, hostname, port } = window.location;
  const apiServerPort = getApiServerPort(port);
  const apiServerPath = getApiServerPath();
  const apiServerEndPoint = `${protocol}//${hostname}:${apiServerPort}${apiServerPath}`;

  clientVars.apiServerEndPoint = apiServerEndPoint;

  const downloadServerPort = getDownloadServerPort(port);
  const downloadServerUrl = `${protocol}//${hostname}:${downloadServerPort}`;
  clientVars.downloadServerUrl = downloadServerUrl;
};

// eslint-disable-next-line no-unneeded-ternary
request.isFinished = () => (clientVars.apiServerEndPoint ? true : false);

export default request;
