/* eslint-disable no-await-in-loop */
import { getCurrentPageNum, getTotalPagesNum } from '../eval/eval-slides.js';

async function testForwardBackward(page) {
  const totalPagesNum = await getTotalPagesNum(page);
  let count = 1;
  for (count; count < totalPagesNum; count += 1) {
    await page.keyboard.down('PageDown');

    expect(await getCurrentPageNum(page)).toBe(count + 1);
  }

  expect(await getCurrentPageNum(page)).toBe(totalPagesNum);
  await page.keyboard.down('PageDown');
  expect(await getCurrentPageNum(page)).toBe(totalPagesNum);

  await page.keyboard.down('Home');
  expect(await getCurrentPageNum(page)).toBe(1);
  await page.keyboard.down('PageUp');
  expect(await getCurrentPageNum(page)).toBe(1);

  await page.keyboard.down('End');
  expect(await getCurrentPageNum(page)).toBe(totalPagesNum);
}

export default testForwardBackward;
