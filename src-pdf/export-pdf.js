/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer-core';
import init from '../test/init.js';
import defaultEnv from '../test/default-env.js';
import { createPageByUrl } from '../test/eval/eval-common.js';
import { gotoFile, getFileNamesByPage } from '../test/eval/eval-file-list.js';
import { getTotalPagesNum } from '../test/eval/eval-slides.js';
import { exportPdf } from '../test/pdf/pdf.js';

async function getFileNames() {
  const browser = await puppeteer.launch({
    executablePath: defaultEnv.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disabled-setupid-sandbox'],
    headless: true,
    defaultViewport: defaultEnv.viewPort,
  });

  const page = await createPageByUrl(browser, defaultEnv.TARGET);
  const fileNames = await getFileNamesByPage(page);
  await browser.close();
  return fileNames;
}

function getPdfFileName(mdxFileName) {
  const fileNameWithoutSuffix = mdxFileName.substring(0, mdxFileName.lastIndexOf('.'));
  let pdfFileName;
  if (fileNameWithoutSuffix) {
    pdfFileName = join(defaultEnv.exportedPdfsRoot, `${fileNameWithoutSuffix}.pdf`);
  } else {
    pdfFileName = join(defaultEnv.exportedPdfsRoot, `${mdxFileName}.pdf`);
  }
  return pdfFileName;
}

const exportOnePDF = async (mdxFileName) => {
  const browser = await puppeteer.launch({
    executablePath: defaultEnv.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disabled-setupid-sandbox'],
    headless: true,
    defaultViewport: defaultEnv.viewPort,
  });

  const page = await createPageByUrl(browser, defaultEnv.TARGET);
  await gotoFile(page, mdxFileName);

  const fileName = getPdfFileName(mdxFileName);
  const totalPagesNum = await getTotalPagesNum(page);

  await exportPdf(page, { totalPagesNum, fileName });
  console.log('Exported', fileName);

  await browser.close();
  return new Promise((resolve) => {
    resolve();
  });
};

async function exportPdfs({ port, dir, name, width, height, format } = {}) {
  let viewPort;
  if (width && height) {
    viewPort = { width, height };
  }
  await init({ port, dir, viewPort, format });

  if (!fs.existsSync(defaultEnv.exportedPdfsRoot)) {
    fs.mkdirSync(defaultEnv.exportedPdfsRoot);
  }

  const fileNames = name ? [name] : await getFileNames();
  console.log('Exporting', fileNames);

  const MAX_BROWSERS = 4;
  const fileGroups = [];
  let files = [];
  fileNames.forEach((mdxFileName, index) => {
    if ((index / MAX_BROWSERS) % 1 === 0) {
      fileGroups.push(files);
      files = [];
    }
    files.push(mdxFileName);
  });
  fileGroups.push(files);
  fileGroups.shift();

  for (let i = 0, { length } = fileGroups; i < length; i += 1) {
    const promises = fileGroups[i].map((mdxFileName) => exportOnePDF(mdxFileName));
    await Promise.all(promises);
  }
}

export default exportPdfs;
