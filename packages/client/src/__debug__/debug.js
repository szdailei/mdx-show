import path from 'path';
import fs from 'fs';
import createPages from '../slides/create-pages';

(async () => {
  const TEST_FILE = './debug.md';
  const dirname = path.dirname(new URL(import.meta.url).pathname);
  const testFile = path.join(dirname, TEST_FILE);

  const markdown = await fs.promises.readFile(testFile, 'utf-8');
  createPages(markdown);
})();
