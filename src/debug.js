import debugSite from './debug/debug-site.js';

const debugVars = {
  writeToFunc: undefined,
};

const debug = (desc, message) => {
  let site;
  try {
    site = debugSite();
  } catch (error) {
    if (error instanceof RangeError) {
      // eslint-disable-next-line no-console
      console.log(`${error.name}:${error.message}\nDebug message is ${message}`);
      return;
    }
    throw error;
  }

  site.desc = desc;
  site.debug = message;
  debugVars.writeToFunc({ data: site });
};

debug.init = ({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack, writeToFunc }) => {
  debugSite.init({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack });
  debugVars.writeToFunc = writeToFunc;
};

export default debug;
