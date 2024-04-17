import fs from 'fs';
import { join, extname } from 'path';
import postcss from 'postcss';
import tailwindConfig from '../../src/client/tailwindcss/config.js';

async function createCss(struc) {
  const { srcDirOfStyleSheet } = struc;
  const files = await fs.promises.readdir(srcDirOfStyleSheet);
  let input = `@tailwind base;@tailwind components;@tailwind utilities;\n`;
  for (let i = 0, { length } = files; i < length; i += 1) {
    const file = files[i];
    if (extname(file) === '.css') {
      // eslint-disable-next-line no-await-in-loop
      input += await fs.promises.readFile(join(srcDirOfStyleSheet, file));
    }
  }

  const result = await postcss([tailwindConfig]).process(input, { from: undefined });

  const { css } = result;
  return css;
}

export default createCss;
