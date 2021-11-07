import React from 'react';
import makeid from '../utils/makeid.js';
import { getRealSrc, removeBlankLine } from '../markdown/markdown.js';
import trim from '../utils/trim.js';
import { Heading, Img, List, P, Span } from '../styled/index.js';
import { PrismCode } from '../components/index.js';
import { isJSXTagAtBegginning } from './parse-jsx-utils.js';
import TableNode from './TableNode.jsx';

function MarkdownNode(token, children, options) {
  const trimedText = trim(token.text);
  const { parent } = options;
  let node;

  switch (token.type) {
    case 'blockquote':
      node = <blockquote key={makeid()}>{children}</blockquote>;
      break;
    case 'code':
      if (token.codeBlockStyle === 'indented' && isJSXTagAtBegginning(trimedText)) {
        node = {
          error: 'jsx',
          type: token.type,
          text: trimedText,
        };
      } else {
        node = <PrismCode key={makeid()} code={token.text} language={token.lang} />;
      }
      break;
    case 'codespan':
      node = <Span key={makeid()}>{token.raw}</Span>;
      break;
    case 'del':
      node = <Span key={makeid()}>{token.raw}</Span>;
      break;
    case 'em':
      node = <em key={makeid()}>{trimedText}</em>;
      break;
    case 'heading':
      node = (
        <Heading key={makeid()} depth={token.depth}>
          {children}
        </Heading>
      );
      break;
    case 'image': {
      let hostname;
      let msg;
      const realSrc = getRealSrc(token.href, 'img');
      if (!trimedText || trimedText === '') {
        try {
          const url = new URL(realSrc);
          hostname = url.hostname;
        } catch (err) {
          hostname = 'localhost';
        }

        msg = `${realSrc} NOT FOUND or DENIED by SERVER. Please contact ${hostname} administrator to change CORS rule, or use LOCAL mdx-show.html instead of mdx-show SERVER to bypass ${hostname} CORS rule, or DOWNLOAD resources to local!`;
      } else {
        msg = trimedText;
      }
      node = <Img key={makeid()} src={realSrc} alt={msg} title={token.title} />;
      break;
    }
    case 'link':
      node = (
        <a key={makeid()} href={token.href} rel="noopener noreferrer" target="_blank">
          {token.raw}
        </a>
      );
      break;
    case 'list':
      node = (
        <List key={makeid()} ordered={token.ordered} depth={options.listDepth}>
          {children}
        </List>
      );
      // eslint-disable-next-line no-param-reassign
      options.listDepth -= 1;
      break;
    case 'list_item':
      node = <li key={makeid()}>{children}</li>;
      break;
    case 'html':
      node = {
        error: 'jsx',
        type: token.type,
        text: trimedText,
      };
      break;
    case 'paragraph':
      if (children.length === 1) {
        if (children[0].type === 'span') {
          node = (
            <P key={makeid()} style={{ marginBlockStart: 'inherit', marginBlockEnd: 'inherit' }}>
              {removeBlankLine(trimedText)}
            </P>
          );
        } else {
          [node] = children;
        }
      } else {
        node = (
          <P key={makeid()} style={{ marginBlockStart: 'inherit', marginBlockEnd: 'inherit' }}>
            {children}
          </P>
        );
      }
      break;
    case 'strong':
      node = <strong key={makeid()}>{children}</strong>;
      break;
    case 'table':
      node = TableNode(token);
      break;
    case 'text':
      if (parent && parent.type === 'paragraph' && parent.tokens && parent.tokens.length === 1) {
        node = (
          <P key={makeid()} style={{ marginBlockStart: 'inherit', marginBlockEnd: 'inherit' }}>
            {children}
          </P>
        );
      } else if (!token.tokens || (token.tokens.length === 1 && token.tokens[0].type === 'text')) {
        node = token.raw;
      } else {
        node = <Span key={makeid()}>{children}</Span>;
      }
      break;
    default:
      throw new TypeError(`Unknown tag of ${token.type}`);
  }

  return node;
}

export default MarkdownNode;
