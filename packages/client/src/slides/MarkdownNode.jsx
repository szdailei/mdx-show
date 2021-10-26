import React from 'react';
import makeid from '../lib/makeid';
import { convertSrcToLocal, convertSrcToServer, removeBlankLine, trim } from '../lib/markdown';
import { Heading, P, Span } from '../styled';
import { PrismCode } from '../components';
import { isJSXTagAtBegginning } from './parse-jsx-utils';
import HtmlNode from './HtmlNode';
import TableNode from './TableNode';

function MarkdownNode(token, children, parent) {
  const trimedText = trim(token.text);
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
    case 'image':
      node = (
        <img
          key={makeid()}
          src={
            window.location.protocol === 'file:'
              ? convertSrcToLocal(token.href, 'img')
              : convertSrcToServer(token.href, 'img')
          }
          alt={trimedText}
          title={token.title}
          style={{ display: 'block', margin: 'auto' }}
        />
      );
      break;
    case 'link':
      node = (
        <a key={makeid()} href={token.href} rel="noopener noreferrer" target="_blank">
          {token.text}
        </a>
      );
      break;
    case 'list':
      if (token.ordered) {
        node = <ol key={makeid()}>{children}</ol>;
      } else {
        node = <ul key={makeid()}>{children}</ul>;
      }
      break;
    case 'list_item':
      node = <li key={makeid()}>{children}</li>;
      break;
    case 'html':
      if (isJSXTagAtBegginning(trimedText)) {
        node = {
          error: 'jsx',
          type: token.type,
          text: trimedText,
        };
      } else {
        node = HtmlNode(trimedText);
      }
      break;
    case 'paragraph':
      if (children.length === 1) {
        if (children[0].type === 'span') {
          node = <P key={makeid()}>{removeBlankLine(trimedText)}</P>;
        } else {
          [node] = children;
        }
      } else {
        node = <P key={makeid()}>{children}</P>;
      }
      break;
    case 'space':
      node = <br key={makeid()} />;
      break;
    case 'strong':
      node = <strong key={makeid()}>{children}</strong>;
      break;
    case 'table':
      node = TableNode(token);
      break;
    case 'text':
      if (parent && parent.type === 'paragraph' && parent.tokens && parent.tokens.length === 1) {
        node = <P key={makeid()}>{children}</P>;
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
