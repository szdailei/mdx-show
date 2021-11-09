import { join } from 'path';
import external from 'rollup-plugin-node-externals';
import { getStructure } from '../structure.js';
import { plugins, rollupBuild } from './rollup.js';

async function buildCliServer() {
  const { root, dest } = await getStructure();

  const nodePlugins = [...plugins];
  nodePlugins.push(external());
  const inputOptions = {
    input: join(root, 'cli.mjs'),
    plugins: nodePlugins,
  };
  
  const outputOptions = {
    dir: dest,
    format: 'esm',
    entryFileNames: 'cli-server.mjs',
    chunkFileNames: '[name]-[hash].js',
  };

  await rollupBuild(inputOptions, outputOptions);
}

export default buildCliServer;
