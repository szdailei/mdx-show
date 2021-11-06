function callStack() {
  const { prepareStackTrace } = Error;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack.slice(1);
  Error.prepareStackTrace = prepareStackTrace;
  return stack;
}

function shortPath(fullPath) {
  const level = 3;
  let path = '';

  const fields = fullPath.split('/');
  let start = fields.length - level;
  start = start >= 0 ? start : 0;
  for (let i = start; i < fields.length; i += 1) {
    path = `${path}/${fields[i]}`;
  }
  return path;
}

function toServer() {}

function debug(data) {
  const stack = callStack();
  const fileName = shortPath(stack[1].getFileName());
  const info = {
    file: fileName,
    func: stack[1].getFunctionName(),
    line: stack[1].getLineNumber(),
    data,
  };

  toServer(info);
}

export default debug;
