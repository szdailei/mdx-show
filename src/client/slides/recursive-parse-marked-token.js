import trim from './trim.js';
import MarkdownNode from './MarkdownNode.jsx';

function isTable(token) {
  if (token.type === 'table') return true;
  return false;
}

function isHtml(token) {
  if (token.type === 'html') return true;
  return false;
}

function isRequiredRecursiveParse(token) {
  if (isTable(token) || isHtml(token)) return false;
  return true;
}

function recursiveParseMarkedToken(token, options = {}) {
  if (token.type === 'list') {
    // eslint-disable-next-line no-param-reassign
    options.listDepth += 1;
  }

  let recursiveParseResult;
  const subTokens = token.tokens || token.items;
  if (subTokens && isRequiredRecursiveParse(token)) {
    recursiveParseResult = [];
    subTokens.forEach((subToken) => {
      // eslint-disable-next-line no-param-reassign
      options.parent = token;
      const subNode = recursiveParseMarkedToken(subToken, options);
      if (!subNode) return;
      recursiveParseResult.push(subNode);
    });
  }

  let children;
  if (recursiveParseResult && recursiveParseResult.length !== 0) {
    children = recursiveParseResult;
  } else {
    children = token.type === 'text' ? token.raw : trim(token.raw);
  }

  if (isRequiredRecursiveParse(token) && !children) return null;
  return MarkdownNode(token, children, options);
}

export default recursiveParseMarkedToken;
