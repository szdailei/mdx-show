/* eslint-disable no-await-in-loop */
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import init from './init';
import config from './config';
import { createPageByUrl } from './lib/eval-common';
import { gotoFile, getFileNamesByPage } from './lib/eval-file-list';
import { exportPdf } from './lib/pdf';

async function getFileNames() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: config.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: config.DEFAULT_VIEWPORT,
  });

  const page = await createPageByUrl(browser, config.TARGET);
  const fileNames = await getFileNamesByPage(page);
  await browser.close();
  return fileNames;
}

(async () => {
  await init();

  if (!fs.existsSync('pdfs')) {
    fs.mkdirSync('pdfs');
  }

  const fileNames = await getFileNames();

  fileNames.forEach(async (fileName) => {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: config.env.PUPPETEER_EXECUTABLE_PATH,
      defaultViewport: config.DEFAULT_VIEWPORT,
    });

    const page = await createPageByUrl(browser, config.TARGET);
    await gotoFile(page, fileName);
    const pdfFileName = await exportPdf(page, fileName);
    // eslint-disable-next-line no-console
    console.log(`Exported file: ${pdfFileName}`);

    await browser.close();
  });
})();
