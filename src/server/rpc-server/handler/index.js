import { sendResponse, forbidden } from '../../http/response';
import getResolver from '../resolver';

async function resolve(req, res, data) {
  const { command, params } = data;
  const resolver = getResolver(command);
  if (!resolver) throw RangeError(`Invalid built-in command: ${command}`);

  const result = await resolver(params, { req, res });
  return result;
}

async function rpcHandler(req, res) {
  if (req.method !== 'POST') {
    forbidden(res);
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', async () => {
    const result = {
      data: null,
      error: null,
    };
    try {
      const reqData = JSON.parse(body);
      result.data = await resolve(req, res, reqData);
    } catch (error) {
      result.error = error.message;
    }
    if (result.data || result.errors) {
      const resData = JSON.stringify(result);
      sendResponse(res, 200, resData);
    } else {
      sendResponse(res, 200);
    }
  });
}

export default rpcHandler;
