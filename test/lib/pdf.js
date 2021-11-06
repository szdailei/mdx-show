/* eslint-disable no-await-in-loop */
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import config from '../config.js';
import { waitForDone, getDocumentViewPort } from './eval-common.js';

async function setFontSizes(page, { fontSize }) {
  const client = await page.target().createCDPSession();
  await client.send('Page.enable');
  await client.send('Page.setFontSizes', {
    fontSizes: {
      standard: fontSize,
    },
  });
}

async function exportPdfBuffersToFile(buffers, { totalPagesNum, fileName }) {
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < totalPagesNum; i += 1) {
    const pdfBytes = await PDFDocument.load(buffers[i]);
    const [firstPage] = await pdfDoc.copyPages(pdfBytes, [0]);
    pdfDoc.addPage(firstPage);
  }

  const pdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(fileName, pdfBytes);
}

async function removeAriaTimers(page) {
  try {
    await page.$$eval('span[role=timer]', (elements) => {
      elements.forEach((element) => {
        element.remove();
      });
    });
  } catch (_) {
    // eslint-disable-next-line no-empty
  }
}

async function createPdfBuffers(page, { totalPagesNum }) {
  const fontSize = config.STANDARD_FONT_SIZE;
  await setFontSizes(page, { fontSize });
  await page.keyboard.up('Home');
  await page.mouse.move(0, 0);

  const pdfBuffers = [];
  for (let i = 0; i < totalPagesNum; i += 1) {
    const viewPort = await getDocumentViewPort(page);

    await removeAriaTimers(page);

    const buffer = config.format ? await page.pdf(config.format) : await page.pdf(viewPort);
    pdfBuffers.push(buffer);
    if (i !== totalPagesNum - 1) {
      await page.keyboard.up('PageDown');
      await waitForDone(page);
    }
  }

  return pdfBuffers;
}

async function exportPdf(page, { fileName, totalPagesNum }) {
  const pdfBuffers = await createPdfBuffers(page, { totalPagesNum });
  await exportPdfBuffersToFile(pdfBuffers, { totalPagesNum, fileName });
}

export { createPdfBuffers, exportPdf };
