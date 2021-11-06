import postcss from 'rollup-plugin-postcss';
import { join } from 'path';
import shell from 'shelljs';
import { getStructure } from '../structure.js';
import { plugins, rollupBuild } from './rollup.js';

async function buildApp() {
  const { srcOfClient, srcOfHtml, destOfWeb } = await getStructure();

  const browserPlugins = [...plugins];
  browserPlugins.push(
    postcss({
      plugins: [],
    })
  );
  const inputOptions = {
    input: join(srcOfClient, 'app.jsx'),
    plugins: browserPlugins,
  };

  const outputOptions = {
    dir: destOfWeb,
    format: 'esm',
    entryFileNames: 'app.js',
    chunkFileNames: '[name]-[hash].js',
  };

  await rollupBuild(inputOptions, outputOptions);

  shell.cp('-R', srcOfHtml, destOfWeb);
}

export default buildApp;
