import { defaultVars, getDefaultStaticServerEndPoint } from './default-vars';
import config from './config';

async function init() {
  config.TARGET = getDefaultStaticServerEndPoint();
  config.env.PUPPETEER_EXECUTABLE_PATH = defaultVars.PUPPETEER_EXECUTABLE_PATH;
}

export default init;
