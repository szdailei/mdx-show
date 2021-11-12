import fs from 'fs';
import path from 'path';

const storage = {
  root: undefined,
};

storage.getStorageRoot = () => storage.root;

storage.setStorageRoot = (root) => {
  storage.root = root;
};

storage.getFile = async (relativeFileName, format) => {
  const fileName = path.join(storage.root, relativeFileName);
  return fs.promises.readFile(fileName, format || 'utf8');
};

storage.getFileList = async (relativeDirName) => {
  const dirName = path.join(storage.root, relativeDirName);
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
