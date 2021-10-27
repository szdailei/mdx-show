import puppeteer from 'puppeteer-core';
import init from '../init';
import config from '../config';
import { createPageByUrl } from '../lib/eval-common';
import { gotoFirstFile } from '../lib/eval-file-list';
import switchFullScreen from './switch-full-screen';

let browser;
let page;

const ptFullScreenReq = `全屏演示。`;
describe(ptFullScreenReq, () => {
  const switchFullScreenStepContr = `按动F键，在全屏和非全屏之间切换。`;
  test(switchFullScreenStepContr, async () => {
    await switchFullScreen(page);
  });
});

beforeAll(async () => {
  await init();

  browser = await puppeteer.launch({
    headless: false,
    executablePath: config.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: config.DEFAULT_VIEWPORT,
  });

  page = await createPageByUrl(browser, config.TARGET);
  await gotoFirstFile(page);
});

afterAll(async () => {
  await browser.close();
});
