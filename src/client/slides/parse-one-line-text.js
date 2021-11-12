import HTML from 'html-parse-stringify';
import { trim } from '../utils/index.js';
import Code from './Code.jsx';
import ReactHOC from './ReactHOC.jsx';

function adjustEmptyStringToTrue(attrs) {
  const obj = {};
  if (!attrs || attrs.length === 0) return obj;

  const keys = Object.getOwnPropertyNames(attrs);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = attrs[key];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      obj[key] = true;
    } else {
      obj[key] = value;
    }
  }

  return obj;
}

function parseCssText(cssText) {
  const result = {};
  const attributes = cssText.split(';');

  for (let i = 0; i < attributes.length; i += 1) {
    const entry = attributes[i].split(':');
    result[entry.splice(0, 1)[0].trim()] = entry.join(':').trim();
  }

  return result;
}

function recursiveParseElement(element) {
  const recursiveParseResult = [];

  const attrs = adjustEmptyStringToTrue(element.attrs);
  if (attrs.style) {
    attrs.style = parseCssText(attrs.style);
  }

  if (element.children && element.children.length !== 0) {
    element.children.forEach((child) => {
      const subNode = recursiveParseElement(child);
      if (subNode) {
        recursiveParseResult.push(subNode);
      }
    });
  }

  let children;
  if (recursiveParseResult.length !== 0) {
    children = recursiveParseResult;
  } else {
    children = trim(element.content);
  }

  if (element.type === 'text') {
    const { content } = element;
    return content;
  }

  const tag = element.name;
  return ReactHOC({ children, tag, attrs });
}

function getCodeText(htmlText) {
  let lines = htmlText.split('<code>');
  let textWithoutOpenTag = '';
  for (let i = 0; i < lines.length; i += 1) {
    textWithoutOpenTag += lines[i];
  }

  let codeText = '';
  lines = textWithoutOpenTag.split('</code>');
  for (let i = 0; i < lines.length; i += 1) {
    codeText += lines[i];
  }

  return codeText;
}

function parseOneLineText(htmlText) {
  const ast = HTML.parse(htmlText);
  if (!ast || ast.length === 0) return null;
  if (ast[0].type === 'tag' && ast[0].name === 'code') {
    const codeText = getCodeText(htmlText);
    return Code(codeText);
  }

  const nodes = [];
  for (let i = 0; i < ast.length; i += 1) {
    const node = recursiveParseElement(ast[i]);
    nodes.push(node);
  }

  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];
  return nodes;
}

export default parseOneLineText;
