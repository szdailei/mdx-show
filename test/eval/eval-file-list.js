/* eslint-disable no-await-in-loop */
import { waitForDone } from './eval-common.js';

async function getFileNamesByPage(page) {
  const elements = await page.$$('a');
  const result = [];
  for (let i = 0; i < elements.length; i += 1) {
    const name = await elements[i].evaluate((node) => node.innerText);
    result.push(name);
  }
  return result;
}

async function getLinkByFileName(page, name) {
  const elements = await page.$$('a');
  for (let i = 0; i < elements.length; i += 1) {
    const result = await elements[i].evaluate((node) => node.innerText);
    if (name === result) return elements[i];
  }
  return null;
}

async function gotoFile(page, fileName) {
  const link = await getLinkByFileName(page, fileName);
  await link.click();
  await waitForDone(page);
}

async function gotoFirstFile(page) {
  const [firstFileName] = await getFileNamesByPage(page);
  const link = await getLinkByFileName(page, firstFileName);
  await link.click();
  await waitForDone(page);
}

export { getFileNamesByPage, gotoFile, gotoFirstFile, getLinkByFileName };
