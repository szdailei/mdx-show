import fs from 'fs';
import { join } from 'path';
import defaultEnv from '../default-env';

const clients = [];
let isLiveReloadServerStarted = false;
function sendServerEventToClient() {
  for (let i = 0, { length } = clients; i < length; i += 1) {
    clients[i].write('event: message\nid: 0\ndata: reload\n\n');
  }
  clients.length = 0;
}

function startLiveReloadServer() {
  fs.watch(join(defaultEnv.staticServer.root, 'index.html'), sendServerEventToClient);
}

function isServerSentEventsReq(url) {
  return url === defaultEnv.sseUrl;
}

function sseServer(req, res) {
  res.writeHead(200, {
    connection: 'keep-alive',
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
  });
  res.write('event: connected\nid: 0\ndata: ready\n\n');
  clients.push(res);

  if (!isLiveReloadServerStarted) {
    startLiveReloadServer();
    isLiveReloadServerStarted = true;
  }
}

export { isServerSentEventsReq, sseServer };
