import puppeteer from 'puppeteer-core';
import init from '../init.js';
import config from '../config.js';
import { createPageByUrl } from '../lib/eval-common.js';
import { gotoFirstFile } from '../lib/eval-file-list.js';
import setTitle from './set-title.js';
import testForwardBackward from './forward-backward.js';
import testPdfBuffers from './pdf-buffers.js';

let browser;
let page;

const ptReq = `
@pain   20200601，代磊使用PowerPoint写作ppt文件，使用PowerPoint播放ppt文件，在胶片格式上浪费时间多。
@expect 20201111，代磊将要使用Linux的VSCode写作mdx文件，将要使用浏览器演示mdx文件，聚集文本内容。
@status 20200601，MS Office将ppt文件解析为专有播放组件在PowerPoint播放。
@goal   20201111，在http://127.0.0.1上，浏览器将mdx文件解析为React组件，将要在浏览器显示。`;
describe(ptReq, () => {
  const setTitleContr = `document.title设置为胶片首页的Title`;
  test(setTitleContr, async () => {
    await setTitle();
  });

  const forwardBackwardContr = `每页如果有title，则footer不可见，否则footer可见。
  到最后一页前，每页footer的currentPageNum等于按动Space键的次数+1。
  到最后一页时，按动Space键，currentPageNum等于totalPagesNum。
  到最后一页时，按动Home键，currentPageNum等于1。
  到第一页时，按动PageUp键，currentPageNum等于1。
  到第一页时，按动End键，currentPageNum等于totalPagesNum。`;
  test(forwardBackwardContr, async () => {
    await testForwardBackward(page);
  });
});

const exportPdfReq = `
@pain
  20200601，代磊将ppt导出为pdf时，纸张大小不可调、阅读不方便。
@expect
  20201111，代磊将md导出pdf时，将要设置适合屏幕阅读的宽度和高度。
@status
  20200601，写作ppt时已经设置了纸张大小，PowerPoint按照预定义纸张大小导出pdf。
@goal
  20201111，在http://127.0.0.1上，mdx文件不设置纸张大小，软件导出pdf时将要设置纸张和字体大小。`;
describe(exportPdfReq, () => {
  const exportPdfContr = `用puppeteer生成当前页面的pdfBuffer，按键PageDown，继续下一页。
pdfBuffer数组长度等于胶片页数`;
  test(
    exportPdfContr,
    async () => {
      await testPdfBuffers(page);
    },
    30000
  );
});

beforeAll(async () => {
  await init();
  browser = await puppeteer.launch({
    headless: true,
    executablePath: config.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: config.viewPort,
  });

  page = await createPageByUrl(browser, config.TARGET);
  await gotoFirstFile(page);
});

afterAll(async () => {
  await browser.close();
});
