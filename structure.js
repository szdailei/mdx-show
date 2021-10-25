import fs from 'fs';
import path from 'path';
import TOMLParser from '@iarna/toml/parse-string';
import getRootDir from './root';

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
    theScriptDir = process.pkg ? path.dirname(process.execPath) : __dirname;
  }
  return theScriptDir;
}

function getWorkDir() {
  return process.cwd();
}

async function getRelativeStructure() {
  const root = getRootDir();
  const structureFile = path.join(root, 'structure.toml');
  const data = await fs.promises.readFile(structureFile, 'utf8');
  const structure = TOMLParser(data);
  structure.root = root
  return structure  
}

function getAbsoluteStructureByStruc(struc) {
  const { root } = struc;

  const readme = path.join(root, struc.readme);
  const example = path.join(root, struc.example);
  const dest = path.join(root, struc.dest);
  const destOfWeb = path.join(root, struc.destOfWeb);
  const destOfConfig = path.join(root, struc.destOfConfig);

  const src = path.join(root, struc.src);
  const srcOfClient = path.join(root, struc.srcOfClient);
  const srcOfWeb = path.join(root, struc.srcOfWeb);
  const srcOfConfig = path.join(root, struc.srcOfConfig);

  return { root, readme, example, dest, destOfWeb, destOfConfig, src, srcOfClient, srcOfWeb, srcOfConfig };
}

async function getStructure() {
  const struc = await getRelativeStructure();
  return getAbsoluteStructureByStruc(struc);
}

export { getTheScriptDir, getWorkDir, getRootDir, getStructure };
