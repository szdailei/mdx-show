import storage from '../../storage';

async function getRoot() {
  const root = await storage.getStorageRoot();
  return root;
}

async function getFileList(params) {
  const fileList = await storage.getFileList(params);
  return fileList;
}

async function getFile(params) {
  const content = await storage.getFile(params);
  return content;
}

export { getRoot, getFileList, getFile };
