import postcss from 'rollup-plugin-postcss';
import { join } from 'path';
import shell from 'shelljs';
import inline from './inline.js';
import { getStructure } from '../structure.js';
import { plugins, rollupBuild } from './rollup.js';

async function buildMdxShowHtml() {
  const { srcOfClient, srcOfHtml, dest, destOfWeb } = await getStructure();

  const browserPlugins = [...plugins];
  browserPlugins.push(
    postcss({
      plugins: [],
    })
  );
  const inputOptions = {
    input: join(srcOfClient, 'local-app.jsx'),
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
  inline(join(destOfWeb, 'index.html'), join(dest, 'mdx-show.html'));
}

export default buildMdxShowHtml;
