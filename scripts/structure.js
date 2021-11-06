import fs from 'fs';
import { join, dirname } from 'path';
import { packageDirectory } from 'pkg-dir';
import TOMLParser from '@iarna/toml/parse-string.js';

/*
@require  none
@ensure
1. return dir of this script if ESModule format. 
    Note, you should copy the code into the first running script if you didn't use pack tool.
    Because theScriptDir is same dir as the first running script only for packed all scripts into one.
2. return dir of the first running script if CJSModule format.
3. return dir of the running exe if exe format packed by pkg.
*/
function getTheScriptDir() {
  const isESModule = typeof __dirname === 'undefined';

  let theScriptDir;
  if (isESModule) {
    theScriptDir = new URL('.', import.meta.url).pathname;
  } else {
    // __dirname is always '/snapshot' in pkg environment, not real script path.
    theScriptDir = process.pkg ? dirname(process.execPath) : __dirname;
  }
  return theScriptDir;
}

function getWorkingDir() {
  return process.cwd();
}

async function getRootDir() {
  const root = await packageDirectory();
  return root;
}

async function getRelativeStructure() {
  const root = await getRootDir();
  const structureFile = join(root, 'scripts/structure.toml');
  const data = await fs.promises.readFile(structureFile, 'utf8');
  const structure = TOMLParser(data);
  structure.root = root;
  return structure;
}

function getAbsoluteStructureByStruc(struc) {
  const { root } = struc;

  const dest = join(root, struc.dest);
  const destOfWeb = join(root, struc.destOfWeb);

  const srcOfServer = join(root, struc.srcOfServer);
  const srcOfClient = join(root, struc.srcOfClient);
  const srcOfHtml = join(root, struc.srcOfHtml);

  const test = join(root, struc.test);

  return {
    root,
    dest,
    destOfWeb,
    srcOfServer,
    srcOfClient,
    srcOfHtml,
    test,
  };
}

async function getStructure() {
  const struc = await getRelativeStructure();
  return getAbsoluteStructureByStruc(struc);
}

export { getTheScriptDir, getWorkingDir, getRootDir, getStructure };
