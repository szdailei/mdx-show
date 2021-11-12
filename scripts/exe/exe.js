import { join } from 'path';
import fs from 'fs';
import { transformSync } from '@babel/core';
import { exec } from 'pkg';
import { getStructure } from '../structure.js';
import buildCliServer from '../rollup/build-cli-server.js';

async function trans(origFile, targetFile) {
  const options = {
    compact: true,
    plugins: ['@babel/plugin-transform-modules-commonjs', 'babel-plugin-transform-import-meta'],
  };

  const source = await fs.promises.readFile(origFile, 'utf8');
  const { code } = transformSync(source, options);
  await fs.promises.writeFile(targetFile, code);
}

async function exeServer(mjsFile, cjsFile, exeFile) {
  await trans(mjsFile, cjsFile);
  await exec([cjsFile, '--target', 'linux-x64,win-x64', '--output', exeFile]);
}

async function exe() {
  await buildCliServer();

  const { dest } = await getStructure();

  const mjsOfServer = join(dest, 'cli-server.mjs');
  const cjsOfServer = join(dest, 'server.cjs');
  const exeOfServer = join(dest, 'server');

  await exeServer(mjsOfServer, cjsOfServer, exeOfServer);
}

export default exe;
