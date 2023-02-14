/* eslint-disable no-console */

import fs from 'fs';
import { spawn } from 'child_process';
import { basename, join } from 'path';

let script;
let child;

function stopServer() {
  if (child) {
    child.kill('SIGINT');
  }
}

function exitProcess() {
  stopServer();
  process.exit(1);
}

function restartServer() {
  if (child) child.kill('SIGINT');
  child = spawn('node', [script, ...process.argv.slice(3)]);

  child.stdout.on('data', (data) => console.log(data.toString()));
  child.stderr.on('data', (data) => console.error(`stderr: ${data}`));
}

async function serve(struc) {
  script = join(struc.outOfServer, basename(struc.entryPointOfServer));

  try {
    await fs.promises.stat(script);
  } catch (error) {
    const dummyScript = '';
    await fs.promises.writeFile(script, dummyScript);
  }

  process.on('SIGINT', exitProcess);
  process.on('SIGTERM', exitProcess);
  process.on('exit', stopServer);
  fs.watch(script, restartServer);
}

export default serve;
