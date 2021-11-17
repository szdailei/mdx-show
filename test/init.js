import { join, isAbsolute } from 'path';
import defaultVars from './default-vars.js';
import config from './config.js';

function init({ port, dir, viewPort, format } = {}) {
  const endPoint = port ? `http://localhost:${port}` : `http://localhost:${defaultVars.port}`;
  config.TARGET = endPoint;
  config.env.PUPPETEER_EXECUTABLE_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || defaultVars.PUPPETEER_EXECUTABLE_PATH;

  const theWorkingDir = process.cwd();
  if (!dir) {
    config.pdfsRoot = join(theWorkingDir, defaultVars.pdfsRoot);
  } else {
    config.pdfsRoot = isAbsolute(dir) ? dir : join(theWorkingDir, dir);
  }

  config.viewPort = viewPort || defaultVars.viewPort;
  config.format = format ? { format } : null;
}

export default init;
