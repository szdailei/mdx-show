import { focusedTagNames } from './html-jsx-to-react/attrs-to-props';

function shouldFocus(element) {
  if (focusedTagNames.includes(element.tagName)) {
    return true;
  }

  if (element.tagName === 'DIV' && element.children.length === 0) {
    return true;
  }

  return false;
}

function isOutside(element) {
  const outsideTagNames = ['HTML', 'BODY', 'ARTICLE', 'SECTION', 'MAIN', 'FOOTER'];
  if (outsideTagNames.includes(element.tagName)) {
    return true;
  }

  if (element.parentNode.nodeName === 'HTML' || element.parentNode.nodeName === 'BODY') {
    return true;
  }

  return false;
}

function focus(element) {
  const mainElements = document.getElementsByTagName('main');
  const first = mainElements[0].firstElementChild;
  const isTheFirst = element === first;

  const headerElements = document.getElementsByTagName('header');
  const noHeader = headerElements.length === 0;

  if (noHeader && isTheFirst) {
    // Maybe title, focuse without focusVisible
    element.focus({ focusVisible: false });
  } else {
    element.focus({ focusVisible: true });
  }
}

function recursiveSearchChildToBeFocused(element, { reverseSearch }) {
  let i;
  i = reverseSearch ? element.children.length - 1 : 0;
  while (reverseSearch ? i >= 0 : i < element.children.length) {
    if (shouldFocus(element.children[i])) {
      return element.children[i];
    }
    const childToBeFocused = recursiveSearchChildToBeFocused(element.children[i], { reverseSearch });
    if (childToBeFocused) {
      return childToBeFocused;
    }

    i = reverseSearch ? i - 1 : i + 1;
  }

  return null;
}

function recursiveSearchSiblingAndUncleToBeFocused(element, { reverseSearch }) {
  if (!element || isOutside(element)) {
    return null;
  }

  let sibling = element;
  for (;;) {
    sibling = reverseSearch ? sibling.previousElementSibling : sibling.nextElementSibling;

    if (!sibling) {
      break;
    }

    if (shouldFocus(sibling)) {
      return sibling;
    }

    const siblingChildToBeFocused = recursiveSearchChildToBeFocused(sibling, { reverseSearch });
    if (siblingChildToBeFocused) {
      return siblingChildToBeFocused;
    }
  }

  const uncleToBeFocused = recursiveSearchSiblingAndUncleToBeFocused(element.parentElement, { reverseSearch });
  return uncleToBeFocused;
}

function focusOnElement(element, options) {
  if (shouldFocus(element)) {
    focus(element);
    return;
  }

  const { reverseSearch } = options || false;

  const childToBeFocused = recursiveSearchChildToBeFocused(element, { reverseSearch });
  if (childToBeFocused) {
    focus(childToBeFocused);
    return;
  }

  const siblingToBeFocused = reverseSearch ? element.previousElementSibling : element.nextElementSibling;
  if (siblingToBeFocused) {
    focusOnElement(siblingToBeFocused, { reverseSearch });
    return;
  }

  const uncleToBeFocused = recursiveSearchSiblingAndUncleToBeFocused(element.parentElement, { reverseSearch });
  if (uncleToBeFocused) {
    focusOnElement(uncleToBeFocused);
  }
}

export function focusOnTheFirst() {
  const mainElements = document.getElementsByTagName('main');
  if (!mainElements || mainElements.length === 0) {
    return;
  }

  const first = mainElements[0].firstElementChild;
  if (!first) {
    return;
  }

  focusOnElement(first, { reverseSearch: false });
}

function focusOnTheLast() {
  const last = document.getElementsByTagName('main')[0].lastElementChild;
  if (last) {
    focusOnElement(last, { reverseSearch: true });
  }
}

export function focusOnPrevious(event) {
  event.preventDefault();
  const { activeElement } = document;
  if (!activeElement || isOutside(activeElement)) {
    focusOnTheLast();
    return;
  }

  const previous =
    activeElement.previousElementSibling ||
    recursiveSearchSiblingAndUncleToBeFocused(activeElement.parentElement, { reverseSearch: true });

  if (previous) {
    focusOnElement(previous, { reverseSearch: true });
  }
}

export function focusOnNext(event) {
  event.preventDefault();
  const { activeElement } = document;
  if (!activeElement || isOutside(activeElement)) {
    focusOnTheFirst();
    return;
  }

  const next =
    activeElement.nextElementSibling ||
    recursiveSearchSiblingAndUncleToBeFocused(activeElement.parentElement, { reverseSearch: false });

  if (next) {
    focusOnElement(next, { reverseSearch: false });
  }
}
