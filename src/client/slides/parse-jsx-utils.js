import trim from '../utils/trim.js';
import emptyTags from '../markdown/empty-tags.js';

function getTagName(text) {
  let tagName = '';
  // The first is '<', skip
  for (let i = 1; i < text.length; i += 1) {
    if (text[i] === ' ' || text[i] === '>') {
      break;
    }
    tagName += text[i];
  }
  return tagName;
}

function matchChars(char, chars) {
  if (!chars) return false;

  for (let i = 0; i < chars.length; i += 1) {
    if (char === chars[i]) return true;
  }
  return false;
}

function matchEmptyChar(char) {
  const emptyChars = [' ', '\t', '\r', '\n'];
  return matchChars(char, emptyChars);
}

function parseText(text, tokens) {
  let textContent = '';
  let isEmpty = true;
  let isAfterStartChars = false;

  for (let i = 0; i < text.length; i += 1) {
    if (matchChars(text[i], tokens.endChars)) {
      break;
    }
    if (isAfterStartChars) {
      textContent += text[i];
      if (!matchEmptyChar(text[i])) {
        isEmpty = false;
      }
    } else if (matchChars(text[i], tokens.startChars)) {
      isAfterStartChars = true;
    }
  }

  if (isEmpty) return null;
  return textContent;
}

function getTheFirstTagTextContent(text) {
  const tokens = {
    startChars: ['<'],
    endChars: ['>'],
  };
  return parseText(text, tokens);
}

function getTextExceptTheFirstTag(text) {
  const tokens = {
    startChars: ['>'],
    endChars: null,
  };
  const result = parseText(text, tokens);
  return trim(result);
}

function getTextWithoutTagName(textWithTagName) {
  const lines = textWithTagName.split(' ');
  let { length } = lines;

  if (lines[lines.length - 1] === '/') length -= 1; // skip '/' in self close tag

  let textWithoutTagName = lines[1]; // lines[0] is tag name, skip it
  for (let i = 2; i < length; i += 1) {
    if (lines[i] !== '') {
      textWithoutTagName += ` ${lines[i]}`;
    }
  }

  return trim(textWithoutTagName);
}

function getPairs(textWithoutTagName) {
  const pairs = [];
  let insideSingleQuote = false;
  let insideDoubleQuote = false;

  let pair = '';
  for (let i = 0; i < textWithoutTagName.length; i += 1) {
    const char = textWithoutTagName[i];
    switch (char) {
      case "'":
        insideSingleQuote = !insideSingleQuote;
        break;
      case '"':
        insideDoubleQuote = !insideDoubleQuote;
        break;
      case ' ':
        if (insideSingleQuote || insideDoubleQuote) {
          pair += char;
        } else {
          pairs.push(pair);
          pair = '';
        }
        break;
      default:
        pair += char;
        break;
    }
  }
  pairs.push(pair);
  return pairs;
}

function getParams(text) {
  const firstTextContent = trim(getTheFirstTagTextContent(text));

  const textWithoutTagName = getTextWithoutTagName(firstTextContent);

  if (!textWithoutTagName) return {};

  const pairs = getPairs(textWithoutTagName);
  const params = {};

  pairs.forEach((pair) => {
    const tokens = pair.split('=');
    const key = tokens[0];
    let value = tokens[1];
    if (value) {
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      params[key] = value;
    } else {
      params[key] = true;
    }
  });

  delete params.undefined;

  return params;
}

function getTextFromChildren(children) {
  if (!children) return null;
  let text = children;
  let node;
  while (text) {
    if (typeof text === 'string') break;
    // eslint-disable-next-line prefer-destructuring
    node = text[0];
    if (node) {
      if (typeof node === 'string') {
        text = node;
      } else {
        text = node.props.children;
      }
    }
  }
  return text;
}

function isCapitalLetter(char) {
  if (char.toUpperCase() === char) return true;
  return false;
}

function isHtmlTag(tagName) {
  return !isCapitalLetter(tagName[0]);
}

function isOpenTagAtBegginning(text) {
  if (text[1] === '/') return false;
  return true;
}

function isEmptyTagAtBeginning(text) {
  const tagName = getTagName(text);
  for (let i = 0; i < emptyTags.length; i += 1) {
    if (emptyTags[i] === tagName) return true;
  }
  return false;
}

function isCloseTagAtBeginning(text) {
  if (text[0] === '<' && text[1] === '/') return true;
  return false;
}

function isCloseTagAtEnd(text) {
  const tokens = text.split('<');
  const lastTagName = tokens[tokens.length - 1];

  if (lastTagName[0] === '/') {
    return true;
  }
  return false;
}

function isSelfCloseTag(text) {
  if (isEmptyTagAtBeginning(text)) return true;

  const firstTagTextContent = getTheFirstTagTextContent(text);
  if (firstTagTextContent[firstTagTextContent.length - 1] === '/') return true;

  return false;
}

function isJSXTagAtBegginning(text) {
  if (text[0] !== '<') return false;
  return true;
}

function addBlankLinesAndRemoveIntent(markdown) {
  const lines = trim(markdown).split('\n');
  let result = '';
  let isInsideCode = false;
  for (let i = 0; i < lines.length; i += 1) {
    const trimedLine = trim(lines[i]);
    if (trimedLine.indexOf('```') !== -1) isInsideCode = !isInsideCode;
    if (!isInsideCode && isJSXTagAtBegginning(trimedLine)) {
      result += `\n\n\n${trimedLine}\n`;
    } else {
      result += `\n${lines[i]}`;
    }
  }

  return trim(result);
}

function modifyTokenIfMultiTagsInOneLine(tokens) {
  tokens.forEach((token) => {
    if (token.type === 'paragraph' && token.text[0] === '<') {
      // eslint-disable-next-line no-param-reassign
      token.type = 'html';
    }
  });
}

export {
  addBlankLinesAndRemoveIntent,
  modifyTokenIfMultiTagsInOneLine,
  getParams,
  getTagName,
  getTheFirstTagTextContent,
  getTextExceptTheFirstTag,
  getTextFromChildren,
  isCloseTagAtBeginning,
  isEmptyTagAtBeginning,
  isCloseTagAtEnd,
  isJSXTagAtBegginning,
  isOpenTagAtBegginning,
  isSelfCloseTag,
  isHtmlTag,
};
