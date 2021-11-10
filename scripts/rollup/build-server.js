import { join } from 'path';
import { existsSync } from 'fs';
import shell from 'shelljs';
import external from 'rollup-plugin-node-externals';
import { getStructure } from '../structure.js';
import { plugins, rollupBuild } from './rollup.js';

async function cleanServer() {
  const { dest } = await getStructure();
  const destServerFile = join(dest, 'server.js');
  if (existsSync(destServerFile)) {
    shell.rm(destServerFile);
  }
}

async function buildServer() {
  const { dest, srcOfServer } = await getStructure();

  const nodePlugins = [...plugins];
  nodePlugins.push(external());
  const inputOptions = {
    input: join(srcOfServer, 'server.js'),
    plugins: nodePlugins,
  };

  const outputOptions = {
    dir: dest,
    format: 'esm',
    entryFileNames: 'server.js',
    chunkFileNames: '[name]-[hash].js',
  };

  await rollupBuild(inputOptions, outputOptions);
}

export { buildServer, cleanServer };
