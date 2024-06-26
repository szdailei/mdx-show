import http from 'http';
import { sendResponse } from './response';
import preProcess from './pre-process';

function requestHandler(req, res, callback) {
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
  preProcess(req, res, callback);
}

function createServer(port, callback) {
  function requestListener(req, res) {
    requestHandler(req, res, callback);
  }

  requestListener.bind(callback);

  const server = http.createServer(requestListener);
  server.listen(port);

  return server;
}

export default createServer;
