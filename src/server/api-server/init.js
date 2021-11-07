import storage from './storage/storage.js';
import logger from './resolvers/logger.js';

function init(storageRoot) {
  storage.setStorageRoot(storageRoot);
  logger.init();
}

export default init;
