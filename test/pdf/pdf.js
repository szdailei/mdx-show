/* eslint-disable no-await-in-loop */
import defaultEnv from '../default-env.js';
import { waitForDone, getDocumentViewPort } from '../eval/eval-common.js';
import toPdf from './to-pdf.js';

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
  const fontSize = defaultEnv.STANDARD_FONT_SIZE;
  await setFontSizes(page, { fontSize });
  await page.keyboard.down('Home');
  await page.mouse.move(0, 0);

  const pdfBuffers = [];
  for (let i = 0; i < totalPagesNum; i += 1) {
    const viewPort = await getDocumentViewPort(page);

    await removeAriaTimers(page);

    const buffer = defaultEnv.format ? await page.pdf(defaultEnv.format) : await page.pdf(viewPort);
    pdfBuffers.push(buffer);
    if (i !== totalPagesNum - 1) {
      await page.keyboard.down('PageDown');
      await waitForDone(page);
    }
  }

  return pdfBuffers;
}

async function toggleFooterClock(page) {
  page.keyboard.press('Shift');
  page.keyboard.press('KeyC');
  await page.waitForTimeout(200);
}

async function exportPdf(page, { fileName, totalPagesNum }) {
  await toggleFooterClock(page);
  const pdfBuffers = await createPdfBuffers(page, { totalPagesNum });
  await toPdf(pdfBuffers, { totalPagesNum, fileName });
}

export { createPdfBuffers, exportPdf };
