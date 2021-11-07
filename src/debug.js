import request from './client/network/client.js';
import callInfo from './debug/caller-info.js';

function toServer(data) {
  const query = {
    command: 'logger',
    params: data,
  };

  request(query);
}

function debug(msg) {
  var aaa = new Error().stack;

  console.log(aaa);
  console.log(callInfo());
  return;

  const stack = callStack();
  const fileName = shortPath(stack[1].getFileName());
  const data = {
    file: fileName,
    func: stack[1].getFunctionName(),
    line: stack[1].getLineNumber(),
    stack,
    //    msg,
  };
  console.log('debug stack', stack);

  // toServer(stack);
}

export default debug;
