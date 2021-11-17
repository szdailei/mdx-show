/* eslint-disable import/no-extraneous-dependencies */
import { exec } from 'pkg';
import { mjsToCjs } from '@szdailei/dev-scripts/scripts/index.js';

async function cjsToExe(cjsFile, exeFile) {
  await exec([cjsFile, '--target', 'linux-x64,win-x64', '--output', exeFile]);
}

async function buildExe() {
  const mjs = 'cli-server.js';
  const cjs = 'cli-server.cjs';
  const { cjsFile, exeFile } = await mjsToCjs(mjs, cjs);

  await cjsToExe(cjsFile, exeFile);
}

export default buildExe;
