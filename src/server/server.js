import { join, isAbsolute } from 'path';
import staticServer from './static-server/static-server.js';
import apiServer from './api-server/api-server.js';
import defaultVars from './default-vars.js';
import { findTheFirstAvailablePort } from './controller/net-port-checker.js';
import { registerRunningServers } from './controller/daemon-controller.js';
import { getApiServerPort, getDownloadServerPort } from '../api-server-vars.js';

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

async function server({ port, web, storage } = {}) {
  const theScriptDir = new URL('.', import.meta.url).pathname;
  const theWorkingDir = process.cwd();

  let staticServerPort = port || defaultVars.staticServer.port;

  if (!port) {
    staticServerPort = await findTheFirstAvailablePort(staticServerPort, { amount: 3 });
    if (!staticServerPort) {
      log('No availablePort');
      process.exit(1);
    }
  }

  let staticRoot;
  if (!web) {
    staticRoot = join(theScriptDir, defaultVars.staticServer.root);
  } else {
    staticRoot = isAbsolute(web) ? web : join(theWorkingDir, web);
  }

  const sServer = staticServer(staticServerPort, { root: staticRoot });
  sServer.name = `${defaultVars.name} web-server`;

  let storageRoot;
  if (!storage) {
    storageRoot = join(theWorkingDir, defaultVars.storage.root);
  } else {
    storageRoot = isAbsolute(storage) ? storage : join(theWorkingDir, storage);
  }

  const aServerPort = getApiServerPort(staticServerPort);
  const aServer = apiServer(aServerPort, { root: storageRoot });
  aServer.name = `${defaultVars.name} api-server`;

  const dServerPort = getDownloadServerPort(staticServerPort);
  const dServer = staticServer(dServerPort, { root: storageRoot });
  dServer.name = `${defaultVars.name} download-server`;

  registerRunningServers([sServer, aServer, dServer]);

  return sServer.address().port;
}

export default server;
