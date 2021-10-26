import storage from '../lib/storage.js';

export default {
  getFileList: async ({ dir }) => {
    const fileList = await storage.getFileList(dir);
    return fileList;
  },
  getFile: async ({ file }) => {
    const content = await storage.getFile(`${file}`);
    if (!content) throw new Error('null result');
    return content;
  },
};
