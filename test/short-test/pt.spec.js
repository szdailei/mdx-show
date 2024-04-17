import puppeteer from 'puppeteer-core';
import init from '../init.js';
import defaultEnv from '../default-env.js';
import { createPageByUrl } from '../eval/eval-common.js';
import { gotoFirstFile } from '../eval/eval-file-list.js';
import testForwardBackward from '../slide-shortcuts/forward-backward.js';
import testPdfBuffers from '../pdf/pdf-buffers.js';

const TIMEOUT = 80000;
let browser;
let page;

const ptReq = `
@pain   20200601，代磊使用PowerPoint写作ppt文件，使用PowerPoint播放ppt文件，在胶片格式上浪费时间多。
@expect 20201111，代磊将要使用Linux的VSCode写作mdx文件，将要使用浏览器演示mdx文件，聚集文本内容。
@status 20200601，MS Office将ppt文件解析为专有播放组件在PowerPoint播放。
@goal   20201111，在http://127.0.0.1上，浏览器将mdx文件解析为React组件，将要在浏览器显示。`;
describe(ptReq, () => {
  const forwardBackwardContr = `
  到最后一页前，每页footer的currentPageNum等于按动Space键的次数+1。
  到最后一页时，按动Space键，currentPageNum等于totalPagesNum。
  到最后一页时，按动Home键，currentPageNum等于1。
  到第一页时，按动PageUp键，currentPageNum等于1。
  到第一页时，按动End键，currentPageNum等于totalPagesNum。`;
  test(
    forwardBackwardContr,
    async () => {
      await testForwardBackward(page);
    },
    TIMEOUT
  );
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
    TIMEOUT
  );
});

beforeAll(async () => {
  init();

  browser = await puppeteer.launch({
    executablePath: defaultEnv.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disabled-setupid-sandbox'],
    headless: true,
    defaultViewport: defaultEnv.viewPort,
  });

  page = await createPageByUrl(browser, defaultEnv.TARGET);
  await gotoFirstFile(page);
});

afterAll(async () => {
  await browser.close();
});
