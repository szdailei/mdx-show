import { createWriteStream } from 'fs';
import debug from '../src/debug.js';

const workFlowVars = {
  loggerFile: undefined,
};

function writeToDisk({ data }) {
  const stream = createWriteStream(workFlowVars.loggerFile, { flags: 'a' });
  stream.write(`${JSON.stringify(data)}\n`);
}

function hello() {
  debug('做某件事', '变量1');
}

function run() {
  hello();
  debug('第二件', '变量2');
}

function workFlow({ loggerFile }) {
  workFlowVars.loggerFile = loggerFile;

  const aboveUrlOfFilterStack = import.meta.url;
  const aboveFuncNameOfFilterStack = workFlow.name;

  debug.init({
    aboveUrlOfFilterStack,
    aboveFuncNameOfFilterStack,
    writeToFunc: writeToDisk,
  });

  run();

  debug('最后', '这是workFlow函数');
}

export default workFlow;
