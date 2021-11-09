const stackVars = {
  entryFunc: undefined,
};

function getCallSites(belowFunc) {
  const error = {};
  const v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, v8StackTrace) => v8StackTrace;
  Error.captureStackTrace(error, belowFunc);
  const origCallSites = error.stack;
  Error.prepareStackTrace = v8Handler;

  const callSites = [];
  for (let i = 0; i < origCallSites.length; i += 1) {
    callSites.push(origCallSites[i]);
    const func = origCallSites[i].getFunctionName();
    if (!func || func === stackVars.entryFunc.name) {
      return callSites;
    }
  }

  return callSites;
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

function getCallSiteData(callSite) {
  const file = shortPath(callSite.getFileName());
  const func = callSite.getFunctionName();
  const line = callSite.getLineNumber();
  return { file, func, line };
}

function createOutputNode(stack) {
  const id = `${stack.file}:${stack.line}`;
  return { id, func: stack.func, line: stack.line };
}

const stack = ({ belowFunc }) => {
  const callSites = getCallSites(belowFunc);
  if (!callSites) return {}

  const callSiteDatas = [];
  callSites.forEach((callSite) => {
    callSiteDatas.push(getCallSiteData(callSite));
  });

  const { id, func, line } = createOutputNode(callSiteDatas[0]);
  return { id, func, line, message: null, callSiteDatas };
};

stack.init = ({ entryFunc }) => {
  stackVars.entryFunc = entryFunc;
};

export default stack;
