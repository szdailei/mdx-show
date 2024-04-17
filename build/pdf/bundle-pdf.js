import fs from 'fs';
import { extname, dirname, basename, join } from 'path';

async function bundlePdf(result) {
  result.outputFiles.forEach(async (file) => {
    await fs.promises.writeFile(file.path, file.contents);

    if (extname(file.path) === '.js') {
      const mjsFileName = `${join(dirname(file.path), basename(file.path, '.js'))}.mjs`;
      await fs.promises.chmod(file.path, 0o755);
      await fs.promises.rename(file.path, mjsFileName);
    }
  });
}

export default bundlePdf;
