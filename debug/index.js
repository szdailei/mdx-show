import { createWriteStream } from 'fs';
import debug from '../src/debug.js';

const mainVars = {
  localFile: './log/debug.log',
};

function writeToDisk({ data }) {
  const fileName = mainVars.localFile;
  const stream = createWriteStream(fileName, { flags: 'a' });
  stream.write(`${JSON.stringify(data)}\n`);
}

function main() {
  debug.init({ entryFunc: main, writeToFunc: writeToDisk });
  debug("HELLO")
}

main();
