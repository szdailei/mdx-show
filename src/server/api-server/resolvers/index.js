import { getFileList, getFile } from './files.js';
import logger from './logger.js';

const resolvers = [getFileList, getFile, logger];

export default resolvers;
