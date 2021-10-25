import path from 'path';
import defaultVars from '../default-vars'
import { getTheScriptDir } from '../structure';
import { getConfig } from './config';
import log from './log';
import staticServer from '../packages/static-server/src/static-server';
import graphqlServer from '../packages/api-server/src/graphql-server';
import storage from '../packages/api-server/src/lib/storage';
import stop from './stop';

(async () => {
  const theScriptDir = getTheScriptDir();
  const relativePathOfConfigFile = 'web/mdx-show.toml';
  const configFile = path.join(theScriptDir, relativePathOfConfigFile);
  let config = {};
  try {
    config = await getConfig(configFile);
  } catch (error) {
    // eslint-disable-next-line no-empty
  }

  const origStorageRoot = config.storage?.root.trim() || theScriptDir;
  const storageRoot = path.isAbsolute(origStorageRoot) ? origStorageRoot : path.join(theScriptDir, origStorageRoot);
  storage.setStorageRoot(storageRoot);

  const origStaticRoot = config['static-server']?.root.trim() || path.join(theScriptDir, 'web');
  const staticRoot = path.isAbsolute(origStaticRoot) ? origStaticRoot : path.join(theScriptDir, origStaticRoot);
  const staticServerPort = config['static-server']?.port || defaultVars.staticServerPort;
  const sServer = staticServer(staticServerPort, staticRoot);
  log.warn(`static-server started on http port ${staticServerPort}`);

  const apiServerPort = config['api-server']?.port || defaultVars.apiServerPort;
  const gServer = graphqlServer(apiServerPort);
  log.warn(`api-server started on http port ${apiServerPort}`);

  const downloadServerPort = config['download-server']?.port || defaultVars.downloadServerPort;
  const dServer = staticServer(downloadServerPort, storage.getStorageRoot());
  log.warn(`download-server started on http port ${downloadServerPort}`);

  function onSignalTerm(eventType) {
    stop(eventType, sServer, gServer, dServer);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });
})();
