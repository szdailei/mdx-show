import { trim } from '../utils/index.js';
import parser from '../markdown/markdown-parser.js';
import recursiveParseMarkedToken from './recursive-parse-marked-token.js';
import { createNode, addNodeToNodeList, getCurrentNode, addComponentToChildren } from './tree.js';
import {
  isCloseTagAtEnd,
  isOpenTagAtBegginning,
  isSelfCloseTag,
  getTextExceptTheFirstTag,
  isCloseTagAtBeginning,
  isHtmlTag,
} from './parse-jsx-utils.js';
import MDXToReactHOC from './MDXToReactHOC.jsx';
import ReactHOC from './ReactHOC.jsx';

function noUse() {}
const contract = noUse;

function isParsingJSX(ctx) {
  return ctx.jsxRoot;
}

function closeJSX(ctx) {
  const currentNode = getCurrentNode(ctx.jsxRoot);
  if (currentNode.tagName === 'Title') {
    ctx.hasTitleInCurrentPage = true;
  }

  let component;
  if (isHtmlTag(currentNode.tagName)) {
    component = ReactHOC.createComponentByNode(currentNode);
  } else {
    component = MDXToReactHOC.createComponentByNode(currentNode);
  }

  addComponentToChildren(ctx.jsxRoot, currentNode, component);

  if (ctx.jsxRoot === currentNode) {
    ctx.pageChildren.push(component);
    ctx.jsxRoot = null;
  }
}

function closeMultiJSXsInOneLine(ctx, inputText) {
  let text = inputText;
  if (!text || text.length < 4) return;

  while (isCloseTagAtBeginning(text)) {
    closeJSX(ctx);

    text = trim(getTextExceptTheFirstTag(text));
    if (!text || text.length < 4) return;
  }
}

function getTokensByMarkdown(markdown) {
  const tokensFromMarked = parser(markdown);
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
            closeJSX(ctx);

            if (!htmlStartIndex) {
              htmlStartIndex = 0;
              htmlStartIndexs.push(htmlStartIndex);
            }

            lastHtmlStartIndex = htmlStartIndexs.pop();
            const currentNode = getCurrentNode(ctx.jsxRoot);
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

export { isParsingJSX, getTokensByMarkdown, openJSX, closeJSX, closeMultiJSXsInOneLine, recursiveSpliceChildren };
