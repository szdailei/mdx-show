import fs from 'fs';
import { extname, dirname, basename, join } from 'path';
import postProcess from './post-process.js';

async function bundleServer(result, _, production) {
  result.outputFiles.forEach(async (file) => {
    if (production) {
      const text = await postProcess(file.text); // No need now. If we define NODE_ENV_PRODUCTION:'true' of esbuild, esbuild will treeShake the dead code
      await fs.promises.writeFile(file.path, text);
    } else {
      await fs.promises.writeFile(file.path, file.text);
    }

    if (extname(file.path) === '.js') {
      const mjsFileName = `${join(dirname(file.path), basename(file.path, '.js'))}.mjs`;
      await fs.promises.chmod(file.path, 0o755);
      await fs.promises.rename(file.path, mjsFileName);
    }
  });
}

export default bundleServer;
