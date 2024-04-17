import { join, isAbsolute } from 'path';
import defaultEnv from './default-env.js';

function init({ port, dir, viewPort, format } = {}) {
  const endPoint = port ? `http://localhost:${port}` : `http://localhost:${defaultEnv.port}`;
  defaultEnv.TARGET = endPoint;
  defaultEnv.PUPPETEER_EXECUTABLE_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || defaultEnv.PUPPETEER_EXECUTABLE_PATH;

  const theWorkingDir = process.cwd();
  if (!dir) {
    defaultEnv.exportedPdfsRoot = join(theWorkingDir, defaultEnv.exportedPdfsRoot);
  } else {
    defaultEnv.exportedPdfsRoot = isAbsolute(dir) ? dir : join(theWorkingDir, dir);
  }

  defaultEnv.viewPort = viewPort || defaultEnv.viewPort;
  defaultEnv.format = format ? { format } : null;
}

export default init;
