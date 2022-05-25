import { join } from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { buildClient, cleanClient } from '@szdailei/dev-scripts/scripts/index.js';
import inline from './inline.js';

async function buildLocalHtml() {
  cleanClient();

  const destOfWeb = await buildClient({ appJsxFile: 'local-app.jsx' });
  const dest = join(destOfWeb, '../');

  inline(join(destOfWeb, 'index.html'), join(dest, 'mdx-show.html'));
}

export default buildLocalHtml;
