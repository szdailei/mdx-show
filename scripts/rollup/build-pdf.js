// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanPdf, buildPdf } from '@szdailei/dev-scripts/scripts/index.js';

async function buildPdfExporter() {
  cleanPdf();

  await buildPdf();
}

export default buildPdfExporter;
