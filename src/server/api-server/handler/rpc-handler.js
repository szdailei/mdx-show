import http from 'http';
import { sendResponse } from '../../http/response.js';
import resolvers from '../resolvers/index.js';

function handler(res, { data }) {
  for (let i = 0; i < resolvers.length; i += 1) {
    if (resolvers[i].name === data.command) {
      // eslint-disable-next-line no-await-in-loop
      return resolvers[i](data.params);
    }
  }
  throw Error(http.STATUS_CODES[404]);
}

function rpcHandler(req, res, { url }, options) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', async () => {
    const result = {
      data: undefined,
      errors: undefined,
    };
    try {
      const reqData = JSON.parse(body);
      result.data = await handler(res, { url, data: reqData }, options);
    } catch (error) {
      result.errors = [
        {
          message: error.message,
          locations: [{ line: 1, column: 1 }],
        },
      ];
    }
    const resData = JSON.stringify(result);
    sendResponse(res, 200, resData);
  });
}

export default rpcHandler;
