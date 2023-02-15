import { getTotalPagesNum } from '../eval/eval-slides.js';
import { createPdfBuffers } from './pdf.js';

async function testPdfBuffers(page) {
  const totalPagesNum = await getTotalPagesNum(page);
  const pdfBuffers = await createPdfBuffers(page, { totalPagesNum });
  expect(pdfBuffers.length).toBe(totalPagesNum);
}

export default testPdfBuffers;
