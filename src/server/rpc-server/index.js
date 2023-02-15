import defaultEnv from '../default-env';
import { sendResponse } from '../http/response';
import { match, router } from './router';

function isRpcReq(url) {
  return url === defaultEnv.rpcUrl;
}

function rpcServer(req, res) {
  const { func } = match(req.url, router);
  if (func) {
    func(req, res);
    return;
  }

  const message = `Not found handler of ${req.url}, method: ${req.method}`;
  const result = {
    errors: [
      {
        message,
        locations: [{ line: 1, column: 1 }],
      },
    ],
  };
  const resData = JSON.stringify(result);
  sendResponse(res, 200, resData);
}

export { isRpcReq, rpcServer };
