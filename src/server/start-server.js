/* eslint-disable no-console */
import os from 'os';
import { dirname, join, isAbsolute } from 'path';
import defaultEnv from './default-env';
import { start, findTheFirstAvailablePort } from './controller';

function getTheScriptDir() {
  const isESModule = typeof __dirname === 'undefined';

  let theScriptDir;
  if (isESModule) {
    theScriptDir = new URL('.', import.meta.url).pathname;
    if (os.type() === 'Windows_NT') {
      theScriptDir = theScriptDir.slice(1);
    }
  } else {
    // __dirname is always '/snapshot' in pkg environment, not real script path.
    theScriptDir = process.pkg ? dirname(process.execPath) : __dirname;
  }
  return theScriptDir;
}

function getWorkingDir() {
  return process.cwd();
}

async function startServer({ client, port, dir, name } = {}) {
  const theScriptDir = getTheScriptDir();
  const theWorkingDir = getWorkingDir();

  let actualPort;
  if (!port) {
    actualPort = await findTheFirstAvailablePort(defaultEnv.staticServer.port, {
      amount: 1,
    });
  } else {
    actualPort = port;
  }
  defaultEnv.staticServer.port = actualPort;

  if (client) {
    defaultEnv.staticServer.root = isAbsolute(client) ? client : join(theWorkingDir, client);
  } else {
    defaultEnv.staticServer.root = join(theScriptDir, defaultEnv.staticServer.root);
  }

  if (dir) {
    defaultEnv.storage.root = isAbsolute(dir) ? dir : join(theWorkingDir, dir);
  } else {
    defaultEnv.storage.root = join(theWorkingDir, defaultEnv.storage.root);
  }

  const message = `  Static root is ${defaultEnv.staticServer.root}\n  Storage root is ${defaultEnv.storage.root}`;
  start(name, actualPort, message);
  return actualPort;
}

export default startServer;
