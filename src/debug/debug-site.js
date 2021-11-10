const debugSiteVars = {
  aboveUrlOfFilterStack: undefined,
  aboveFuncNameOfFilterStack: undefined,
};

function getCallSitesBetweenBelowAndAbove(belowFuncOfFilterStack) {
  const error = {};
  const v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, v8StackTrace) => v8StackTrace;
  Error.captureStackTrace(error, belowFuncOfFilterStack);
  const callSites = error.stack;
  Error.prepareStackTrace = v8Handler;

  const callSitesBetweenBelowAndAbove = [];
  for (let i = 0; i < callSites.length; i += 1) {
    callSitesBetweenBelowAndAbove.push(callSites[i]);
    const fileName = callSites[i].getFileName();
    const funcName = callSites[i].getFunctionName();

    if (fileName === debugSiteVars.aboveUrlOfFilterStack && funcName === debugSiteVars.aboveFuncNameOfFilterStack) {
      return callSitesBetweenBelowAndAbove;
    }

    if (!funcName) {
      throw RangeError(
        `Above ${debugSiteVars.aboveUrlOfFilterStack}:${
          debugSiteVars.aboveFuncNameOfFilterStack
        }, called by ${callSites[0].getFileName()}:${callSites[0].getFunctionName()}`
      );
    }
  }

  return callSitesBetweenBelowAndAbove;
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

function parseCallSite(callSite) {
  const file = shortPath(callSite.getFileName());
  const func = callSite.getFunctionName();
  const line = callSite.getLineNumber();
  return { file, func, line };
}

function createDebugSite(callSite) {
  const id = `${callSite.getFileName()}:${callSite.getLineNumber()}`;
  return { id, func: callSite.getFunctionName(), line: callSite.getLineNumber() };
}

const debugSite = ({ belowFuncOfFilterStack }) => {
  const callSites = getCallSitesBetweenBelowAndAbove(belowFuncOfFilterStack);

  const site = createDebugSite(callSites[0]);

  const formattedStack = [];
  for (let i = 1; i < callSites.length; i += 1) {
    formattedStack.push(parseCallSite(callSites[i]));
  }

  return { ...site, message: undefined, stack: formattedStack };
};

debugSite.init = ({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack }) => {
  debugSiteVars.aboveUrlOfFilterStack = aboveUrlOfFilterStack;
  debugSiteVars.aboveFuncNameOfFilterStack = aboveFuncNameOfFilterStack;
};

export default debugSite;
