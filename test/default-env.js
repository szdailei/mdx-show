import serverDefaultVars from '../src/server/default-env.js';

const defaultVars = {
  port: serverDefaultVars.staticServer.port,
  PUPPETEER_EXECUTABLE_PATH: '/usr/bin/chromium',
  exportedPdfsRoot: 'exported-pdfs',
  viewPort: {
    width: 1920,
    height: 1080,
  },
  LOADED_TAG: 'article',
  STANDARD_FONT_SIZE: 16,
  env: {},
};

export default defaultVars;
