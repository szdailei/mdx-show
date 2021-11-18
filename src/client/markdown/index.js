import { lexer as parser } from 'marked';
import emptyTags from './empty-tags.js';
import realSrc, { isFileUrl } from './real-source.js';

function removeBlankLine(text) {
  let result = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== '\r' && text[i] !== '\n') {
      result += text[i];
    }
  }
  return result;
}

export { parser , emptyTags, realSrc, isFileUrl, removeBlankLine };
