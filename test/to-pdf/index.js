/* eslint-disable no-await-in-loop */
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

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

export default exportPdfBuffersToFile;
