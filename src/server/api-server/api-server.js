import init from './init.js'
import startServer from '../http/start-server.js';
import { notFound } from '../http/response.js';
import match from './route/match.js';
import routers from './route/routers.js';

async function resolveUrl(req, res, { method, url }, options) {
  const { func } = match(url, routers);
  if (func) {
    func(req, res, { method, url }, options);
    return;
  }

  notFound(res);
}

function apiServer(port, options) {
  init(options.root)

  const server = startServer(port, options, resolveUrl);
  return server;
}

export default apiServer;
