import fs from 'fs';
import path from 'path';
import TOML from 'toml';
import { getWorkDir, getTheScriptDir } from '../structure';

async function getConfig(configFileName) {
  const data = await fs.promises.readFile(configFileName, 'utf8');
  return TOML.parse(data);
}

async function getConfigInConfigScriptDir(configFileName) {
  const configScriptDir = getTheScriptDir();
  return getConfig(path.join(configScriptDir, configFileName));
}

async function getConfigInWorkDir(configFileName) {
  const workingPath = getWorkDir();
  return getConfig(path.join(workingPath, configFileName));
}

export { getConfig, getConfigInConfigScriptDir, getConfigInWorkDir };
