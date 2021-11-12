import defaultVars from '../default-vars.js';
import storage from './storage/storage.js';
import logger from './resolvers/logger.js';

function init(storageRoot) {
  storage.setStorageRoot(storageRoot);
  logger.setLoggerFileSuffix(defaultVars.logger.fileSuffix);
}

export default init;
