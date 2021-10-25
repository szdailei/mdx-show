import path from 'path';
import fs from 'fs';
import { transformSync } from '@babel/core';
import { exec } from 'pkg';

async function trans(origFile, targetFile) {
  const options = {
    compact: true,
    plugins: ['@babel/plugin-transform-modules-commonjs', 'babel-plugin-transform-import-meta'],
  };

  const source = await fs.promises.readFile(origFile, 'utf8');
  const { code } = transformSync(source, options);
  await fs.promises.writeFile(targetFile, code);
}

async function bundleServer(mjs, cjs, exe) {
  await trans(mjs, cjs);
  await exec([cjs, '--target', 'linux-x64,win-x64', '--output', exe]);
}

async function bundleServers(dest) {
  const mjs = path.join(dest, 'index.js');
  const cjs = path.join(dest, 'index.cjs');
  const exe = path.join(dest, 'mdx-show');

  await bundleServer(mjs, cjs, exe);
}

export default bundleServers;
