import fs from 'fs';
import path from 'path';
import defaultEnv from '../../default-env';

const storage = {};

storage.getFile = async (relativeFileName, format) => {
  const fileName = path.join(defaultEnv.storage.root, relativeFileName);
  return fs.promises.readFile(fileName, format || 'utf8');
};

storage.getFileList = async (relativeDirName) => {
  const dirName = path.join(defaultEnv.storage.root, relativeDirName);
  const files = await fs.promises.readdir(dirName);
  const fileNames = [];
  for (let i = 0; i < files.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const stats = await fs.promises.stat(path.join(dirName, files[i]));
    if (stats.isFile()) {
      fileNames.push(files[i]);
    }
  }
  return fileNames;
};

export default storage;
