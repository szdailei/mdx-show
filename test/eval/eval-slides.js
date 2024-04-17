async function getPageNumFields(page) {
  const footer = await page.$eval('footer', (element) => element.textContent);
  const footerStr = footer.toString();

  const fields = footerStr.split(' ');
  const pageNumStr = fields[fields.length - 1];

  const pageNumFields = pageNumStr.split('/');
  return pageNumFields;
}

async function getCurrentPageNum(page) {
  const pageNumFields = await getPageNumFields(page);
  const currentPageNum = Number.parseInt(pageNumFields[pageNumFields.length - 2], 10);
  return currentPageNum;
}

async function getTotalPagesNum(page) {
  const pageNumFields = await getPageNumFields(page);
  const totalPagesNum = Number.parseInt(pageNumFields[pageNumFields.length - 1], 10);
  return totalPagesNum;
}

export { getCurrentPageNum, getTotalPagesNum };
