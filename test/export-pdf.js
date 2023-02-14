/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import { join } from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import puppeteer from 'puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import init from './init.js';
import defaultEnv from './default-env.js';
import { createPageByUrl } from './eval/eval-common.js';
import { gotoFile, getFileNamesByPage } from './eval/eval-file-list.js';
import { getTotalPagesNum } from './eval/eval-slides.js';
import { exportPdf } from './pdf/pdf.js';

async function getFileNames() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: defaultEnv.env.PUPPETEER_EXECUTABLE_PATH,
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

  fileNames.forEach(async (mdxFileName) => {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: defaultEnv.env.PUPPETEER_EXECUTABLE_PATH,
      defaultViewport: defaultEnv.viewPort,
    });

    const page = await createPageByUrl(browser, defaultEnv.TARGET);
    await gotoFile(page, mdxFileName);

    const fileName = getPdfFileName(mdxFileName);
    const totalPagesNum = await getTotalPagesNum(page);

    await exportPdf(page, { totalPagesNum, fileName });
    console.log('Exported', fileName);

    await browser.close();
  });
}

export default exportPdfs;
