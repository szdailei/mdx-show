import http from 'http';
import { sendResponse, forbidden } from '../../http/response.js';
import resolvers from '../resolvers/index.js';

function handler(req, res, { data }) {
  for (let i = 0; i < resolvers.length; i += 1) {
    if (resolvers[i].name === data.command) {
      // eslint-disable-next-line no-await-in-loop
      return resolvers[i](data.params, req, res);
    }
  }
  throw RangeError(http.STATUS_CODES[404]);
}

function rpcHandler(req, res, { method, url }, options) {
  if (method !== 'POST') {
    forbidden(res);
    return;
  }

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
      result.data = await handler(req, res, { url, data: reqData }, options);
    } catch (error) {
      result.errors = [
        {
          message: error.message,
          locations: [{ line: 1, column: 1 }],
        },
      ];
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
