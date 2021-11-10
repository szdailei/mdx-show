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

function hello() {
  debug('做某件事');
}

function run() {
  hello();
  debug('第二件');
}

function workFlow() {
  const aboveUrlOfFilterStack = import.meta.url;
  const aboveFuncNameOfFilterStack = workFlow.name;

  debug.init({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack, writeToFunc: writeToDisk });
  run();

  debug('最后');
}

export default workFlow;
