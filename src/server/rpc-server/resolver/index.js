import { getRoot, getFileList, getFile } from './resolvers/files';

function getResolver(command) {
  const builtIns = [getRoot, getFileList, getFile];
  Object.defineProperty(getRoot, 'name', { value: 'getRoot' });
  Object.defineProperty(getFileList, 'name', { value: 'getFileList' });
  Object.defineProperty(getFile, 'name', { value: 'getFile' });

  for (let i = 0, { length } = builtIns; i < length; i += 1) {
    const builtIn = builtIns[i];
    if (builtIn.name === command) {
      return builtIn;
    }
  }
  return null;
}

export default getResolver;
