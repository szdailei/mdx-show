import { trim } from '../lib/markdown';
import MarkdownNode from './MarkdownNode';

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

function recursiveParseMarkedToken(token, parent) {
  let recursiveParseResult;
  const subTokens = token.tokens || token.items;
  if (subTokens && isRequiredRecursiveParse(token)) {
    recursiveParseResult = [];
    subTokens.forEach((subToken) => {
      const subNode = recursiveParseMarkedToken(subToken, token);
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
  return MarkdownNode(token, children, parent);
}

export default recursiveParseMarkedToken;
