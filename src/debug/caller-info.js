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

function callerInfo() {
  const { prepareStackTrace } = Error;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack.slice(1);
  Error.prepareStackTrace = prepareStackTrace;

  console.log('stack0000', new Error().stack);
  console.log('stack1111', new Error().stack.slice(1));

  const fileName = shortPath(stack[1].getFileName());
  const functionName = stack[1].getFunctionName();
  const line = stack[1].getLineNumber();

  return { fileName, functionName, line };
}

export default callerInfo;
