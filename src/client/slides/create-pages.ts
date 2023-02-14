import type { ReactElementWithhChildren } from './html-jsx-to-react/index.d';

function createPages(elements: ReactElementWithhChildren[]) {
  const { length } = elements;
  const pages: ReactElementWithhChildren[][] = [];
  let pageElements: ReactElementWithhChildren[] = [];
  for (let i = 0; i < length; i += 1) {
    const element = elements[i];
    if (element.type === 'hr') {
      pages.push(pageElements);
      pageElements = [];
    } else {
      pageElements.push(element);
    }
  }
  pages.push(pageElements);

  return pages;
}

export default createPages;
