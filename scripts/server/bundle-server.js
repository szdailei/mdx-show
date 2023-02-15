import fs from 'fs';
import { extname } from 'path';
import postProcess from './post-process.js';

async function bundleServer(result, struc, production) {
  result.outputFiles.forEach(async (file) => {
    let text;
    if (production && extname(file.path) === '.js') {
      text = await postProcess(file.text); // No need now. If we define NODE_ENV_PRODUCTION:'true' of esbuild, esbuild will treeShake the dead code
      //      text = file.text;
    } else {
      text = file.text;
    }

    await fs.promises.writeFile(file.path, text);
    if (extname(file.path) === '.js') {
      await fs.promises.chmod(file.path, 0o755);
    }
  });
}

export default bundleServer;
