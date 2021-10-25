async function getCurrentPageNum(page) {
  const footer = await page.$eval('footer', (element) => element.textContent);
  const footerStr = footer.toString();
  const rightStr = footerStr.slice(footerStr.length - 7);

  const tokens = rightStr.split('/');
  return Number.parseInt(tokens[0].trim(), 10);
}

async function getTotalPagesNum(page) {
  const footer = await page.$eval('footer', (element) => element.textContent);
  const tokens = footer.split('/');
  return Number.parseInt(tokens[1].trim(), 10);
}

async function isFooterHidden(page) {
  const result = await page.$eval('footer', (element) => {
    const style = window.getComputedStyle(element);
    if (style.visibility === 'hidden') {
      return true;
    }
    return false;
  });
  return result;
}

export { getCurrentPageNum, getTotalPagesNum, isFooterHidden };
