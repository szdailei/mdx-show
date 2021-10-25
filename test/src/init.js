import { getStructure } from '../../structure';
import { getConfig } from '../../src/config';
import config from './config';

async function init() {
  const { destOfConfig } = await getStructure();
  const configData = await getConfig(destOfConfig);

  config.TARGET = `http://localhost:${configData['static-server'].port}`;
  config.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/chromium';
}

export default init;
