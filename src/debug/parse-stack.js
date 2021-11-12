function isV8JSEngine() {
  return !!Error.captureStackTrace;
}

function hasPort(fieldsLength, fileAndLine) {
  if (fieldsLength === 5) return true;
  if (fieldsLength === 4) return false;
  throw TypeError(`Unknow format of Error stack: ${fileAndLine}`);
}

function parseFileAndLine(fileAndLine) {
  const fields = fileAndLine.split(':');

  let file;
  let line;
  if (hasPort(fields.length)) {
    file = `${fields[0]}:${fields[1]}:${fields[2]}`;
    line = `${fields[3]}`;
  } else {
    file = `${fields[0]}:${fields[1]}`;
    line = `${fields[2]}`;
  }

  return { file, line };
}

function parseV8CallerText(text) {
  let func;
  let fileAndLine;
  const braceIndex = text.indexOf(' (');
  if (braceIndex === -1) {
    func = undefined;
    fileAndLine = text;
  } else {
    func = text.slice(0, braceIndex);
    fileAndLine = text.slice(braceIndex + 2, text.length - 1);
  }

  const { file, line } = parseFileAndLine(fileAndLine);

  return { file, func, line };
}

function parseFirefoxCallerText(text) {
  const atIndex = text.indexOf('@');

  const func = text.slice(0, atIndex);
  const fileAndLine = text.slice(atIndex + 1, text.length - 1);

  const { file, line } = parseFileAndLine(fileAndLine);

  return { file, func, line };
}

function parseStack(stack) {
  const lines = stack.split('\n');
  const parsed = [];

  if (isV8JSEngine()) {
    for (let i = 1; i < lines.length; i += 1) {
      const callerText = lines[i].slice(lines[i].indexOf('at') + 3);
      const caller = parseV8CallerText(callerText);
      parsed.push(caller);
    }
  } else {
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].trim() !== '') {
        const caller = parseFirefoxCallerText(lines[i]);
        parsed.push(caller);
      }
    }
  }

  return parsed;
}

export default parseStack;
