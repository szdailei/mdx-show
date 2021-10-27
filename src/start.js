import staticServer from '../packages/static-server/src/static-server.js';
import graphqlServer from '../packages/api-server/src/graphql-server.js';
import storage from '../packages/api-server/src/lib/storage.js';
import log from './log.js';
import stop from './stop.js';

function start({ staticRoot, storageRoot, staticServerPort, apiServerPort, downloadServerPort }) {
  storage.setStorageRoot(storageRoot);

  const sServer = staticServer(staticServerPort, staticRoot);
  log.warn(`web-server started on port ${staticServerPort}`);
  log.warn(`Please visit http://localhost:${staticServerPort} to show your slides\n`);

  const gServer = graphqlServer(apiServerPort);
  log.warn(`api-server started on port ${apiServerPort}`);

  const dServer = staticServer(downloadServerPort, storage.getStorageRoot());
  log.warn(`download-server started on port ${downloadServerPort}`);

  function onSignalTerm(eventType) {
    stop(eventType, sServer, gServer, dServer);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });
}

export default start;
