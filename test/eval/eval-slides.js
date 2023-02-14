async function getCurrentPageNum(page) {
  const footer = await page.$eval('footer', (element) => element.textContent);
  const footerStr = footer.toString();

  const fields = footerStr.split(' ');
  const pageNumStr = fields[fields.length - 1]
  const pageNumFields = pageNumStr.split('/')
  const currentPageNum = Number.parseInt(pageNumFields[pageNumFields.length - 2], 10);
  return currentPageNum;
}

async function getTotalPagesNum(page) {
  const footer = await page.$eval('footer', (element) => element.textContent);
  const footerStr = footer.toString();
  const fields = footerStr.split(' ');
  const pageNumStr = fields[fields.length - 1]
  const pageNumFields = pageNumStr.split('/')
  const totalPagesNum = Number.parseInt(pageNumFields[pageNumFields.length - 1], 10);
  return totalPagesNum;
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
