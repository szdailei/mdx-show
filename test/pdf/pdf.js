/* eslint-disable no-await-in-loop */
import config from '../config.js';
import { waitForDone, getDocumentViewPort } from '../eval/eval-common.js';
import toPdf from '../to-pdf/index.js';

async function setFontSizes(page, { fontSize }) {
  const client = await page.target().createCDPSession();
  await client.send('Page.enable');
  await client.send('Page.setFontSizes', {
    fontSizes: {
      standard: fontSize,
    },
  });
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
  await toPdf(pdfBuffers, { totalPagesNum, fileName });
}

export { createPdfBuffers, exportPdf };
