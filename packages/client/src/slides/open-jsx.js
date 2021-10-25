import marked from 'marked';
import { debug, JSX_PARSE } from '../lib/debug';
import recursiveParseMarkedToken from './recursive-parse-marked-token';
import { createNode, addNodeToNodeList, getCurrentNode } from './tree';
import { isCloseTagAtEnd, isOpenTagAtBegginning, isSelfCloseTag, getTextExceptTheFirstTag } from './parse-jsx-utils';
import { closeJSX } from './close-jsx';

const contract = debug(JSX_PARSE);

function isParsingJSX(ctx) {
  return ctx.jsxRoot;
}

function getTokensByMarkdown(markdown) {
  const tokensFromMarked = marked.lexer(markdown);
  let tokens;
  if (
    tokensFromMarked.length &&
    tokensFromMarked.length === 1 &&
    tokensFromMarked[0].type === 'paragraph' &&
    tokensFromMarked[0].tokens
  ) {
    tokens = tokensFromMarked[0].tokens;
  } else {
    tokens = tokensFromMarked;
  }
  return tokens;
}

/*
@require  ctx isn't null, and text has jsx open tag at beginning.
@ensure   
  1. Create jsxRoot or addNode to current nodeList.
  2. Remove first jsx open tag and recursiveParse rest text.
*/
function openJSX(ctx, text) {
  contract('@require JSX open tag \n%s', text);
  const node = createNode(text);
  const textExceptTheFirstTag = getTextExceptTheFirstTag(text);

  if (!ctx.jsxRoot) {
    contract('@require ctx.jsxRoot不存在 \n@ensure  新增ctx.jsxRoot');
    ctx.jsxRoot = node;
  } else {
    contract('@require ctx.jsxRoot存在 \n\t\tensure  ctx.jsxRoot添加子节点');
    addNodeToNodeList(ctx.jsxRoot, node);
  }

  if (textExceptTheFirstTag) {
    const tokens = getTokensByMarkdown(textExceptTheFirstTag);

    contract('@require MD in JSX \n%s\n@ensure 解析为%O', textExceptTheFirstTag, tokens);
    tokens.forEach((token) => {
      contract('@require token \n%O \n@ensure 递归解析为subNode', token);
      const subNode = recursiveParseMarkedToken(token);
      if (!subNode) return;

      if (subNode.error) {
        if (isOpenTagAtBegginning(subNode.text)) {
          contract('@require JSX有子节点文本\n%s\n@ensure 递归JSX open tag', subNode.text);
          openJSX(ctx, subNode.text);
        } else {
          contract('@require JSX close tag \n%s\n@ensure 结束解析JSX子节点文本', subNode.text);
          closeJSX(ctx);
        }
        return;
      }

      if (subNode.props) {
        contract(
          '@require JSX文本被解析成%s个children\n\t\t@ensure 递归寻找children里的JSXTag，解析后修改children',
          subNode.props.children.length
        );
        // eslint-disable-next-line no-use-before-define
        recursiveSpliceChildren(subNode.props.children);
        const currentNode = getCurrentNode(ctx.jsxRoot);
        currentNode.children.push(subNode);
      }
    });
  }
}

function recursiveSpliceChildren(inputChildren) {
  let children = inputChildren;
  const ctx = {
    pageChildren: [],
    jsxRoot: null,
  };

  while (children) {
    if (children.length === 1 && children[0].props) {
      children = children[0].props.children;
    } else {
      let htmlStartIndex;
      let lastHtmlStartIndex;
      const htmlStartIndexs = [];

      if (!Array.isArray(children)) return;

      for (let i = 0; i < children.length; i += 1) {
        if (children[i].error) {
          if (isOpenTagAtBegginning(children[i].text)) {
            htmlStartIndex = i;
            htmlStartIndexs.push(htmlStartIndex);
            openJSX(ctx, children[i].text);
          }

          if (
            !isOpenTagAtBegginning(children[i].text) ||
            isSelfCloseTag(children[i].text) ||
            isCloseTagAtEnd(children[i].text)
          ) {
            const currentNode = getCurrentNode(ctx.jsxRoot);
            closeJSX(ctx);

            if (!htmlStartIndex) {
              htmlStartIndex = 0;
              htmlStartIndexs.push(htmlStartIndex);
            }

            lastHtmlStartIndex = htmlStartIndexs.pop();
            children.splice(lastHtmlStartIndex, i - lastHtmlStartIndex + 1, currentNode.component);
            i = lastHtmlStartIndex;
          }
        } else if (isParsingJSX(ctx)) {
          const currentNode = getCurrentNode(ctx.jsxRoot);
          currentNode.children.push(children[i]);
        } else if (children[i].props) {
          recursiveSpliceChildren(children[i].props.children);
        }
      }
      break;
    }
  }
}

export { isParsingJSX, getTokensByMarkdown, openJSX, recursiveSpliceChildren };
