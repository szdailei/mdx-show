import http from 'http';
import stream from 'stream';

function sendResponseBySteam(res, statusCode, statusMessage) {
  res.writeHead(statusCode);

  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(statusMessage));
  bufferStream.pipe(res);
}

/**
@require res.headersSent is false
*/
function sendResponse(res, statusCode, statusMessage) {
  if (statusMessage) {
    sendResponseBySteam(res, statusCode, statusMessage);
  } else {
    res.writeHead(statusCode);
    res.end();
  }
}

function notFound(res) {
  if (res.headersSent) {
    res.end();
    return;
  }
  res.setHeader('Content-Type', 'text/plain');
  sendResponse(res, 404, http.STATUS_CODES[404]);
}

function forbidden(res) {
  if (res.headersSent) {
    res.end();
    return;
  }
  res.setHeader('Content-Type', 'text/plain');
  sendResponse(res, 403, http.STATUS_CODES[403]);
}

export { sendResponse, notFound, forbidden };
