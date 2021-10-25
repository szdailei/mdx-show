import React from 'react';
import makeid from '../lib/makeid';
import { convertSrcToLocal, convertSrcToServer, trim } from '../lib/markdown';
import { Div, Span } from '../styled';
import { VideoJS } from '../components';

function camelCase(name) {
  let camelName = name;
  switch (name) {
    case 'autoplay':
      camelName = 'autoPlay';
      break;
    case 'crossorigin':
      camelName = 'crossOrigin';
      break;
    case 'srclang':
      camelName = 'srcLang';
      break;
    default:
      break;
  }
  return camelName;
}

function getAttributeValues(attributes) {
  if (!attributes) return null;
  const obj = {};
  const keys = Object.getOwnPropertyNames(attributes);
  for (let i = 0; i < keys.length; i += 1) {
    if (Number.isNaN(Number.parseInt(keys[i].trim(), 10))) {
      const key = camelCase(keys[i]);
      if (attributes[keys[i]].value === '') {
        obj[key] = true;
      } else {
        obj[key] = attributes[keys[i]].value;
      }
    }
  }
  return obj;
}

function recursiveParseElement(element) {
  const recursiveParseResult = [];

  if (element.childNodes.length !== 0) {
    element.childNodes.forEach((child) => {
      const subNode = recursiveParseElement(child);
      if (subNode) {
        recursiveParseResult.push(subNode);
      }
    });
  }

  const attributes = getAttributeValues(element.attributes);

  let children;
  if (recursiveParseResult.length !== 0) {
    children = recursiveParseResult;
  } else {
    children = trim(element.textContent);
  }

  let node;
  let src;
  let options;

  switch (element.nodeName) {
    case 'BR':
      node = <br key={makeid()} />;
      break;
    case 'DEL':
      node = <del key={makeid()}>{children}</del>;
      break;
    case 'STRONG':
      node = <strong key={makeid()}>{children}</strong>;
      break;
    case 'DIV':
      node = (
        <Div key={makeid()} {...attributes}>
          {children}
        </Div>
      );
      break;
    case 'SPAN':
      node = (
        <Span key={makeid()} {...attributes}>
          {children}
        </Span>
      );
      break;
    case 'HR':
      node = <hr key={makeid()} />;
      break;
    case 'SOURCE':
      src =
        window.location.protocol === 'file:'
          ? convertSrcToLocal(attributes.src, 'video')
          : convertSrcToServer(attributes.src, 'video');
      attributes.src = src;
      node = <source key={makeid()} {...attributes} />;
      break;
    case 'TRACK':
      src =
        window.location.protocol === 'file:'
          ? convertSrcToLocal(attributes.src, 'video')
          : convertSrcToServer(attributes.src, 'video');
      attributes.src = src;
      node = <track key={makeid()} {...attributes} />;
      break;
    case 'U':
      node = <u key={makeid()}>{children}</u>;
      break;
    case 'VIDEO':
      options = {
        crossOrigin: 'anonymous',
        controls: true,
        preload: 'auto',
        width: attributes.width,
        height: attributes.height,
      };
      node = (
        <VideoJS key={makeid()} options={options}>
          {children}
        </VideoJS>
      );
      break;
    case '#text':
      node = children;
      break;
    default:
      throw new TypeError(`Unknown html tag of ${element.tagName}`);
  }
  return node;
}

function HtmlNode(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const nodes = [];

  for (let i = 0; i < doc.body.children.length; i += 1) {
    const node = recursiveParseElement(doc.body.children[i]);
    nodes.push(node);
  }

  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];
  return nodes;
}

export default HtmlNode;
