import shell from 'shelljs';
import { getStructure } from '../structure.js';
import { buildServer } from './build-server.js';
// import {buildLocalHtml} from './build-local-html.js';
import { buildApp } from './build-app.js';

function clean(dest) {
  shell.rm('-rf', dest);
  shell.mkdir(dest);
}

(async () => {
  const { dest } = await getStructure();
  clean(dest);

  await buildServer();

  //  await buildLocalHtml();
  await buildApp();

  /*
  inputOptions.input = join(test, 'export-slides.js');
  outputOptions.entryFileNames = 'pdfs.js';
  inputOptions.treeshake = {
    preset: 'smallest',
    propertyReadSideEffects: false,
    unknownGlobalSideEffects:false
  }
  await rollupBuild(inputOptions, outputOptions);
*/
})();
