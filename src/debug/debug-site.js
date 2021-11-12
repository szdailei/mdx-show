import parseStack from './parse-stack.js';

const CALLER_BEBOW_DEPTH = 3;

const debugSiteVars = {
  aboveUrlOfFilterStack: undefined,
  aboveFuncNameOfFilterStack: undefined,
};

function isAtAboveFunc(caller) {
  if (caller.file === debugSiteVars.aboveUrlOfFilterStack && caller.func === debugSiteVars.aboveFuncNameOfFilterStack)
    return true;

  return false;
}

function getCallersBetweenBelowAndAbove() {
  const { stack } = new Error();
  const callers = parseStack(stack);

  let atAboveFunc = false;

  const callersBetweenBelowAndAbove = [];
  for (let i = CALLER_BEBOW_DEPTH; i < callers.length; i += 1) {
    if (isAtAboveFunc(callers[i])) {
      atAboveFunc = true;
    } else if (atAboveFunc) {
      return callersBetweenBelowAndAbove;
    }
    callersBetweenBelowAndAbove.push(callers[i]);

    if (!callers[i].func) {
      throw RangeError(
        `Above ${debugSiteVars.aboveUrlOfFilterStack}:${debugSiteVars.aboveFuncNameOfFilterStack}, called by ${callers[i].file}:${callers[i].line}:${callers[i].func}`
      );
    }
  }

  return callersBetweenBelowAndAbove;
}

function shortPath(fullPath) {
  const fileUrlIndex = fullPath.indexOf('file:///');
  if (fileUrlIndex !== 0) return fullPath;

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

function createDebugSite(caller) {
  const id = `${caller.file}:${caller.line}`;
  return { id, func: caller.func, line: caller.line };
}

const debugSite = () => {
  const callers = getCallersBetweenBelowAndAbove();

  const site = createDebugSite(callers[0]);

  const formattedStack = [];
  for (let i = 1; i < callers.length; i += 1) {
    formattedStack.push({
      file: shortPath(callers[i].file),
      func: callers[i].func,
      line: callers[i].line,
    });
  }

  return { ...site, desc: undefined, debug: undefined, stack: formattedStack };
};

debugSite.init = ({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack }) => {
  debugSiteVars.aboveUrlOfFilterStack = aboveUrlOfFilterStack;
  debugSiteVars.aboveFuncNameOfFilterStack = aboveFuncNameOfFilterStack;
};

export default debugSite;
