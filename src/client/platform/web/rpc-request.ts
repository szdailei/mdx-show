import defaultEnvOfServer from '../../../server/default-env';

async function createErrorByRes(res: Response) {
  const resBody = await res.text();
  return new RangeError(`${res.status}: ${res.statusText}: ${resBody}`);
}

function parseResBody(res: Response, resType: string) {
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

type Query = {
  command: string;
  params: string;
};

const httpRequest = async (query: Query) => {
  const resType = 'json';
  const endPoint = httpRequest.rpcServerEndPoint as string;
  const options = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    body: query ? JSON.stringify(query) : null,
  };

  let data: unknown | null | RangeError;
  try {
    const res = await fetch(endPoint, options);
    if (!res.ok) {
      const resNotOkError = await createErrorByRes(res);
      return resNotOkError;
    }

    type Result = {
      data: unknown | null;
      error: string | null;
    };

    const result = (await parseResBody(res, resType)) as Result | null;
    if (!result) {
      data = new RangeError('resType wrong or response body format wrong');
    } else if (result.error) {
      data = new RangeError(result.error);
    } else {
      data = result.data;
    }
  } catch (err) {
    data = err instanceof Error ? new RangeError(err.message) : new RangeError(String(err));
  }

  return data;
};

httpRequest.rpcServerEndPoint = undefined;

httpRequest.init = () => {
  const { protocol, hostname, port } = window.location;
  const { rpcUrl } = defaultEnvOfServer;
  httpRequest.rpcServerEndPoint = `${protocol}//${hostname}:${port}${rpcUrl}`;
};

export default httpRequest;
