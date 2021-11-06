import globalVars from '../global-vars.js';

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

async function request(body) {
  const resType = 'json';
  const endPoint = globalVars.apiServerEndPoint;
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
}

export default request;
