import fs from 'fs';
import { basename, extname, join } from 'path';
import crypto from 'crypto';
import createHtml from './create-html.js';
import createCss from './create-css.js';

function createHash(data) {
  const hash = crypto.createHash('shake256', { outputLength: 4 }).update(data).digest('hex');
  return hash.toUpperCase();
}

function getFirstName(filename) {
  const fields = filename.split('.');
  return fields[0];
}

async function bundleClient(result, struc, production) {
  const { entryPointOfClient, assetsOfClient, outOfClient, outOfClientAssets } = struc;

  const mainJs = getFirstName(basename(entryPointOfClient));
  let jsFileName;
  const jsAndMapFiles = [];

  for (let i = 0, { length } = result.outputFiles; i < length; i += 1) {
    const { path, contents } = result.outputFiles[i];
    if (extname(path) === '.js') {
      const basenameOfJs = basename(path);
      if (getFirstName(basenameOfJs) === mainJs) {
        jsFileName = basenameOfJs;
      }
      jsAndMapFiles.push({ path, contents });
    } else if (extname(path) === '.map') {
      jsAndMapFiles.push({ path, contents });
    } else {
      throw new TypeError(`Unsupported file: ${path}`);
    }
  }

  await Promise.all(
    jsAndMapFiles.map(async ({ path, contents }) => {
      await fs.promises.writeFile(path, contents);
    })
  );

  const css = await createCss(struc);
  const hash = createHash(css);
  const cssFileName = `index.${hash}.css`;

  const outFileOfCss = join(outOfClient, cssFileName);
  fs.promises.writeFile(outFileOfCss, css, { encoding: 'utf8' });

  const htmlFileName = join(outOfClient, 'index.html');
  const html = createHtml(jsFileName, cssFileName, production);
  fs.promises.writeFile(htmlFileName, html, { encoding: 'utf8' });

  try {
    await fs.promises.stat(outOfClientAssets);
  } catch (error) {
    await fs.promises.mkdir(outOfClientAssets, { recursive: true });
  }

  fs.promises.cp(assetsOfClient, outOfClientAssets, { recursive: true });
}

export default bundleClient;
