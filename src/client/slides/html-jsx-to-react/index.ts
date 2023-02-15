import React, { type HTMLProps, type FunctionComponent } from 'react';
import htmlTags, { htmlTags as TagName } from 'html-tags';
import * as acorn from 'acorn';
import { ecmaVersion as EcmaVersion } from 'acorn';
import acornJsx from 'acorn-jsx';
import { generate } from 'astring';
import { buildJsx } from 'estree-util-build-jsx';
import { type Node as EstreeNode } from 'estree-util-build-jsx/lib';
import * as htmlparser2 from 'htmlparser2';
import { isText, type Element as DomElement, type DataNode } from 'domhandler';
import makeid from '../../utils/makeid';
import { attrsToProps, attribsToString } from './attrs-to-props';
import modifyPropsOfMedia from './modify-props-of-media';
import { evalTextNode } from './eval-code';
import getBuiltInComponent from '../../built-in';
import mdxToHtmlJsx from '../mdx-to-html-jsx';
import type { ReactElementWithhChildren, CreatedNode } from './index.d';
import type { PlayGroundProps } from '../../built-in/built-ins/PlayGround';

function compileJsxToJs(jsx: string) {
  const Parser = acorn.Parser.extend(acornJsx());
  const ecmaVersion: EcmaVersion = 'latest';
  const options = {
    ecmaVersion,
  };
  const estree = Parser.parse(jsx, options) as EstreeNode;

  const node = buildJsx(estree);
  const js = generate(node);
  return js;
}

function removeExport(origJsx: string) {
  let jsx = '';
  const lines = origJsx.split('\n');
  for (let i = 0, { length } = lines; i < length; i += 1) {
    const line = lines[i].trim();
    if (line.startsWith('export ', 0)) {
      const rest = line.slice(7).trim();
      if (!rest.startsWith('{', 0)) {
        if (rest.startsWith('default ', 0)) {
          const realJsx = rest.slice(8).trim();
          if (realJsx.startsWith('function') || realJsx.startsWith('async') || realJsx.startsWith('(')) {
            jsx += `${realJsx}\n`;
          }
        } else {
          jsx += `${rest}\n`;
        }
      }
    } else {
      jsx += `${lines[i]}\n`;
    }
  }
  return jsx;
}

function createP(text: string) {
  const props = {
    key: makeid(),
    tabIndex: 0,
  };
  const element = React.createElement('p', props, text);
  return element;
}

function shouldNotEval(node) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (node.parent && node.parent.name === 'code') {
    return true;
  }
  return false;
}

function createNodesByDepthFirst(currentNodes: DomElement[], jsCode?: string) {
  const createdNodes: CreatedNode[] = [];

  currentNodes.forEach((currentNode: DomElement) => {
    let createdNode: CreatedNode;

    const { name } = currentNode;

    if (isText(currentNode)) {
      // text node
      const { data } = currentNode as unknown as DataNode;
      const isWhitespace = data.trim().length === 0;
      if (isWhitespace) return;

      if (shouldNotEval(currentNode)) {
        createdNode = data;
      } else {
        createdNode = evalTextNode(data, jsCode);
      }

      createdNodes.push(createdNode);
      return;
    }

    const children = createNodesByDepthFirst(currentNode.children as DomElement[], jsCode);

    const tagName = name as TagName;
    const props = attrsToProps(currentNode.attribs, tagName, jsCode) as HTMLProps<unknown> & PlayGroundProps;
    modifyPropsOfMedia(props, tagName);

    const builtIn = getBuiltInComponent(tagName) as FunctionComponent;
    if (builtIn) {
      // built in react component
      if (builtIn.name === 'PlayGround') {
        props.mdxToReact = mdxToReact;
        props.jsCode = jsCode;
      }

      createdNode = React.createElement(builtIn, props, children);
      createdNodes.push(createdNode);
      return;
    }

    if (htmlTags.includes(tagName)) {
      // html element
      if (tagName === 'p' && typeof children !== 'string' && !Array.isArray(children)) {
        createdNodes.push(children);
        return;
      }
      createdNode = children
        ? (React.createElement(tagName, props, children) as ReactElementWithhChildren)
        : (React.createElement(tagName, props) as ReactElementWithhChildren);

      createdNodes.push(createdNode);
      return;
    }

    // external react component
    const propsString = attribsToString(currentNode.attribs);
    const codeForCreateElement = `${jsCode}\n return React.createElement(${tagName}, ${propsString})`;

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    createdNode = Function('React', codeForCreateElement)(React) as CreatedNode;
    createdNodes.push(createdNode);
  });

  if (createdNodes.length === 0) return null;
  if (createdNodes.length === 1) {
    return createdNodes[0];
  }
  return createdNodes;
}

function htmlJsxToReact(html: string, origJsxCode?: string) {
  let jsCode: string;
  if (origJsxCode) {
    const jsxCode = removeExport(origJsxCode);
    jsCode = compileJsxToJs(jsxCode);
  }

  const options = { lowerCaseTags: false, lowerCaseAttributeNames: false };
  const { children } = htmlparser2.parseDocument(html, options);

  const nodes = createNodesByDepthFirst(children as DomElement[], jsCode) as ReactElementWithhChildren[] | string;

  const elements: ReactElementWithhChildren[] = [];
  if (typeof nodes === 'string') {
    elements.push(createP(nodes));
    return elements;
  }

  if (nodes instanceof Array) {
    nodes.forEach((node) => {
      if (!node) return;

      if (typeof node === 'string') {
        elements.push(createP(node));
      } else {
        elements.push(node);
      }
    });

    return elements;
  }

  return [nodes];
}

function mdxToReact(mdx: string, jsCode: string) {
  const { html, jsxCode } = mdxToHtmlJsx(mdx);
  const allJsxCode = `${jsCode}\n${jsxCode}`;

  const elements = htmlJsxToReact(html, allJsxCode);
  return elements;
}

export default htmlJsxToReact;
