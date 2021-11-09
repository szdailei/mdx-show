import stack from './debug/stack.js';

const debugVars = {
  writeToFunc: undefined,
};

const debug = (message) => {
  const debugStack = stack({ belowFunc: debug });
  debugStack.message = message;
  debugVars.writeToFunc({data:debugStack});
};

debug.init = ({ entryFunc, writeToFunc }) => {
  stack.init({ entryFunc });
  debugVars.writeToFunc = writeToFunc;
};

export default debug;
