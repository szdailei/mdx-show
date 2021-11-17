import serverDefaultVars from '../src/server/default-vars.js';

const defaultVars = {
  port: serverDefaultVars.staticServer.port,
  PUPPETEER_EXECUTABLE_PATH: '/usr/bin/chromium',
  pdfsRoot: 'exported-pdfs',
  viewPort: {
    width: 1920,
    height: 1080,
  },
};

export default defaultVars;
