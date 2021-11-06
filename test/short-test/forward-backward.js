/* eslint-disable no-await-in-loop */
import { getCurrentPageNum, getTotalPagesNum, isFooterHidden } from '../lib/eval-slides.js';
import { isTitleExist } from '../lib/eval-common.js';

async function testForwardBackward(page) {
  const totalPagesNum = await getTotalPagesNum(page);
  let count = 1;
  expect(await isFooterHidden(page)).toBe(await isTitleExist(page));

  for (count; count < totalPagesNum; count += 1) {
    await page.keyboard.up('PageDown');
    expect(await isFooterHidden(page)).toBe(await isTitleExist(page));
    expect(await getCurrentPageNum(page)).toBe(count + 1);
  }

  expect(await getCurrentPageNum(page)).toBe(totalPagesNum);
  await page.keyboard.up('PageDown');
  expect(await getCurrentPageNum(page)).toBe(totalPagesNum);

  await page.keyboard.up('Home');
  expect(await getCurrentPageNum(page)).toBe(1);
  await page.keyboard.up('PageUp');
  expect(await getCurrentPageNum(page)).toBe(1);

  await page.keyboard.up('End');
  expect(await getCurrentPageNum(page)).toBe(totalPagesNum);
}

export default testForwardBackward;
