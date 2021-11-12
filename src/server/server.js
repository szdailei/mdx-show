import { join, dirname, isAbsolute } from 'path';
import staticServer from './static-server/static-server.js';
import apiServer from './api-server/api-server.js';
import defaultVars from './default-vars.js';
import { findTheFirstAvailablePort } from './controller/net-port-checker.js';
import { registerRunningServers } from './controller/daemon-controller.js';
import { getApiServerPort, getDownloadServerPort } from '../api-server-vars.js';

/*
@require  none
@ensure
1. return dir of this script if ESModule format. 
    Note, you should copy the code into the first running script if you didn't use pack tool.
    Because theScriptDir is same dir as the first running script only for packed all scripts into one.
2. return dir of the first running script if CJSModule format.
3. return dir of the running exe if exe format packed by pkg.
*/
function getTheScriptDir() {
  const isESModule = typeof __dirname === 'undefined';

  let theScriptDir;
  if (isESModule) {
    theScriptDir = new URL('.', import.meta.url).pathname;
  } else {
    // __dirname is always '/snapshot' in pkg environment, not real script path.
    theScriptDir = process.pkg ? dirname(process.execPath) : __dirname;
  }
  return theScriptDir;
}

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

async function server({ port, web, storage } = {}) {
  const theScriptDir = getTheScriptDir();
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
