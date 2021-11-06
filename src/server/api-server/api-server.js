import startServer from '../http/start-server.js';
import { notFound, forbidden } from '../http/response.js';
import match from './route/match.js';
import routers from './route/routers.js';
import storage from './storage/storage.js';

async function resolveUrl(req, res, { method, url }, options) {
  if (method !== 'POST') {
    forbidden(res);
    return;
  }

  const { func } = match(url, routers);
  if (func) {
    func(req, res, { method, url }, options);
    return;
  }

  notFound(res);
}

function apiServer(port, options) {
  storage.setStorageRoot(options.root);

  const server = startServer(port, options, resolveUrl);
  return server;
}

export default apiServer;
