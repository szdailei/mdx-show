/* eslint-disable no-await-in-loop */
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import config from '../config';
import { waitForDone, getDocumentViewPort } from './eval-common';
import { getTotalPagesNum } from './eval-slides';

async function setFontSizes(page) {
  const client = await page.target().createCDPSession();
  await client.send('Page.enable');
  await client.send('Page.setFontSizes', {
    fontSizes: {
      standard: config.STANDARD_FONT_SIZE,
    },
  });
}

async function exportPdfBuffersToFile(pdfFileName, pdfBuffers, totalPagesNum) {
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < totalPagesNum; i += 1) {
    const pdfBytes = await PDFDocument.load(pdfBuffers[i]);
    const [firstPage] = await pdfDoc.copyPages(pdfBytes, [0]);
    pdfDoc.addPage(firstPage);
  }

  const pdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(pdfFileName, pdfBytes);
}

async function createPdfBuffers(page, totalPagesNum, format) {
  await setFontSizes(page);
  await page.keyboard.up('Home');
  await page.mouse.move(0, 0);

  const pdfBuffers = [];
  for (let i = 0; i < totalPagesNum; i += 1) {
    const viewPort = await getDocumentViewPort(page);
    const buffer = format ? await page.pdf(format) : await page.pdf(viewPort);
    pdfBuffers.push(buffer);
    if (i !== totalPagesNum - 1) {
      await page.keyboard.up('PageDown');
      await waitForDone(page);
    }
  }

  return pdfBuffers;
}

async function exportPdf(page, origFileName, origTotalPagesNum, format) {
  const totalPagesNum = origTotalPagesNum || (await getTotalPagesNum(page));
  const fileNameWithoutSuffix = origFileName.substring(0, origFileName.lastIndexOf('.'));
  let pdfFileName;
  if (fileNameWithoutSuffix) {
    pdfFileName = `${config.PDFS_DIR}${fileNameWithoutSuffix}.pdf`;
  } else {
    pdfFileName = `${config.PDFS_DIR}${origFileName}.pdf`;
  }

  const pdfBuffers = await createPdfBuffers(page, totalPagesNum, format);
  await exportPdfBuffersToFile(pdfFileName, pdfBuffers, totalPagesNum);
  return pdfFileName;
}

export { createPdfBuffers, exportPdf };
