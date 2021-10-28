import React from 'react';
import HTML from 'html-parse-stringify';
import makeid from '../lib/makeid';
import { getRealSrc, trim } from '../lib/markdown';
import { VideoJS } from '../components';
import MDXToReactHOC from './MDXToReactHOC';

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

  let node;
  let options;
  let tag;
  let params;

  if (element.type === 'text') {
    node = trim(element.content);
    return node;
  }

  switch (element.name) {
    case 'br':
      return <br key={makeid()} />;
    case 'del':
      return <del key={makeid()}>{children}</del>;
    case 'strong':
      return <strong key={makeid()}>{children}</strong>;
    case 'code':
      return <code key={makeid()}>{children}</code>;
    case 'div':
      return (
        <div key={makeid()} {...attrs}>
          {children}
        </div>
      );
    case 'span':
      return (
        <span key={makeid()} {...attrs}>
          {children}
        </span>
      );
    case 'hr':
      return <hr key={makeid()} />;
    case 'source':
      attrs.src = getRealSrc(attrs.src, 'video');
      return <source key={makeid()} {...attrs} />;
    case 'track':
      attrs.src = getRealSrc(attrs.src, 'video');
      return <track key={makeid()} {...attrs} />;
    case 'u':
      return <u key={makeid()}>{children}</u>;
    case 'video':
      options = {
        crossOrigin: 'anonymous',
        controls: true,
        preload: 'auto',
        width: attrs.width,
        height: attrs.height,
      };
      return (
        <VideoJS key={makeid()} options={options}>
          {children}
        </VideoJS>
      );
    case '#text':
      return children;
    default:
      tag = element.name;
      params = element.attrs;
      return MDXToReactHOC({ children, tag, params });
  }
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

function HtmlNode(htmlText) {
  const ast = HTML.parse(htmlText);
  if (ast[0].type === 'tag' && ast[0].name === 'code') {
    const codeText = getCodeText(htmlText);
    return <code key={makeid()}>{codeText}</code>;
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

export default HtmlNode;
