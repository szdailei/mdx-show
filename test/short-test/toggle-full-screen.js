import { isFullscreen } from '../lib/eval-common.js';

async function toggleFullScreen(page) {
  const status = await isFullscreen(page);
  await page.keyboard.up('KeyF');
  await page.waitForTimeout(200);
  expect(await isFullscreen(page)).toBe(!status);

  await page.keyboard.up('KeyF');
  await page.waitForTimeout(200);
  expect(await isFullscreen(page)).toBe(status);
}

export default toggleFullScreen;
