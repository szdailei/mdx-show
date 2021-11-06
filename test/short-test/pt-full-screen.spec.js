import puppeteer from 'puppeteer-core';
import init from '../init.js';
import config from '../config.js';
import { createPageByUrl } from '../lib/eval-common.js';
import { gotoFirstFile } from '../lib/eval-file-list.js';
import toggleFullScreen from './toggle-full-screen.js';

let browser;
let page;

const ptFullScreenReq = `全屏演示。`;
describe(ptFullScreenReq, () => {
  const toggleFullScreenStepContr = `按动F键，在全屏和非全屏之间切换。`;
  test(toggleFullScreenStepContr, async () => {
    await toggleFullScreen(page);
  });
});

beforeAll(async () => {
  await init();

  browser = await puppeteer.launch({
    headless: false,
    executablePath: config.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: config.viewPort,
  });

  page = await createPageByUrl(browser, config.TARGET);
  await gotoFirstFile(page);
});

afterAll(async () => {
  await browser.close();
});
