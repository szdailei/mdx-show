import { join, isAbsolute } from 'path';
import staticServer from './static-server/index.js';
import apiServer from './api-server/index.js';
import defaultVars from './default-vars.js';
import { getTheScriptDir } from './utils/index.js';
import { findTheFirstAvailablePort, registerRunningServers } from './controller/index.js';
import { getApiServerPort, getDownloadServerPort } from '../api-server-vars.js';

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

async function server({ port, dir, name } = {}) {
  const theScriptDir = getTheScriptDir();
  const theWorkingDir = process.cwd();

  let staticServerPort = port || defaultVars.staticServer.port;

  if (!port) {
    staticServerPort = await findTheFirstAvailablePort(staticServerPort, {
      amount: 3,
    });
    if (!staticServerPort) {
      log('No availablePort');
      process.exit(1);
    }
  }

  const staticRoot = join(theScriptDir, defaultVars.staticServer.root);

  const sServer = staticServer(staticServerPort, { root: staticRoot });
  sServer.name = `${name} web-server`;

  let storageRoot;
  if (!dir) {
    storageRoot = join(theWorkingDir, defaultVars.storage.root);
  } else {
    storageRoot = isAbsolute(dir) ? dir : join(theWorkingDir, dir);
  }

  const aServerPort = getApiServerPort(staticServerPort);
  const aServer = apiServer(aServerPort, {
    storageRoot,
    loggerFileSuffix: defaultVars.logger.fileSuffix,
  });
  aServer.name = `${name} api-server`;

  const dServerPort = getDownloadServerPort(staticServerPort);
  const dServer = staticServer(dServerPort, { root: storageRoot });
  dServer.name = `${name} download-server`;

  registerRunningServers([sServer, aServer, dServer]);

  return sServer.address().port;
}

export default server;
