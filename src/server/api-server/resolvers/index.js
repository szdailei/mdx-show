import { getFileList, getFile } from './files.js';
import log from './log.js';

const resolvers = [getFileList, getFile, log];

export default resolvers;
