import config from '../config.js';

async function waitForDone(page) {
  const maxTimeout = 5000;
  await page.waitForSelector(config.LOADED_TAG, {
    timeout: maxTimeout,
  });
}

async function createPageByUrl(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
  await waitForDone(page);
  return page;
}

async function getDocumentViewPort(page) {
  const viewPort = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  return viewPort;
}

async function getDocumentTitle(page) {
  const documentTitle = await page.evaluate(() => document.title);
  return documentTitle;
}

async function getTextContentById(page, id) {
  try {
    return await page.$eval(id, (element) => element.textContent);
  } catch (_) {
    return null;
  }
}

async function isFullscreen(page) {
  const result = await page.evaluate(() => {
    if (document.fullscreenElement) return true;
    return false;
  });
  return result;
}

async function isTitleExist(page) {
  try {
    await page.$eval('#title', () => null);
    return true;
  } catch (_) {
    return false;
  }
}

export {
  createPageByUrl,
  waitForDone,
  getDocumentViewPort,
  getDocumentTitle,
  getTextContentById,
  isFullscreen,
  isTitleExist,
};
