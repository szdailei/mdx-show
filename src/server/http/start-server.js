import http from 'http';
import { sendResponse } from './response.js';

const allowOrigin = '*';
const allowHeaders = '*';
const allowMethods = 'GET,POST,OPTIONS';

function resolveRequest(req, res, options, callback) {
  if (res.headersSent) {
    res.end();
    return;
  }

  const url = req.url.trim();
  const { method } = req;
  switch (method) {
    case 'OPTIONS':
      res.writeHead(200, {
        'Access-Control-Allow-Headers': allowHeaders,
        'Access-Control-Allow-Methods': allowMethods,
      });
      res.end();
      return;
    case 'GET':
    case 'POST':
      res.setHeader('Access-Control-Allow-Origin', allowOrigin);
      callback(req, res, { method, url }, options);
      return;
    default:
      res.writeHead(405, {
        'Access-Control-Allow-Headers': allowHeaders,
        'Access-Control-Allow-Methods': allowMethods,
      });
      res.end();
  }
}

function requestHandler(req, res, options, callback) {
  req.on('error', (err) => {
    if (res.headersSent) {
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    sendResponse(res, 400, err.toString(), err.toString().length);
  });

  if (res.headersSent) {
    res.end();
    return;
  }
  resolveRequest(req, res, options, callback);
}

function startServer(port, options, callback) {
  function handler(req, res) {
    requestHandler(req, res, options, callback);
  }

  handler.bind(options);
  handler.bind(callback);

  const server = http.createServer();
  server.on('request', handler);
  server.listen(port);

  return server;
}

export default startServer;
