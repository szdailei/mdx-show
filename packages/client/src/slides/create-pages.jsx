import parser from '../lib/markdown-parser';
import { debug, MD_PARSE } from '../lib/debug';
import {
  addBlankLines,
  modifyTokenIfMultiTagsInOneLine,
  isOpenTagAtBegginning,
  isSelfCloseTag,
  getTagName,
  getTheFirstTagTextContent,
  getTextExceptTheFirstTag,
} from './parse-jsx-utils';
import recursiveParseMarkedToken from './recursive-parse-marked-token';
import { closeJSX } from './close-jsx';
import { isParsingJSX, getTokensByMarkdown, openJSX, recursiveSpliceChildren } from './open-jsx';
import { getCurrentNode, addComponentToChildren } from './tree';
import Page from './Page';
import { ExampleContainer, isExampleTag } from './Example';

const contract = debug(MD_PARSE);

function createTotalPagesNum(tokens) {
  let totalCount = 1;
  tokens.forEach((token) => {
    if (token.type === 'hr') {
      totalCount += 1;
    }
  });
  return totalCount;
}

function finishOnePage(ctx, pages) {
  for (let i = 0; i < ctx.pageChildren.length; i += 1) {
    if (ctx.pageChildren[i].props && ctx.pageChildren[i].props.tag === 'Footer') {
      ctx.currentFooter = ctx.pageChildren[i];
      ctx.pageChildren.splice(i, 1);
      i -= 1;
    }
  }

  const page = Page.createPage(ctx);
  pages.push(page);
}

function parsePageBreak(ctx, pages) {
  finishOnePage(ctx, pages);
  ctx.pageChildren = [];
  ctx.currentPageNum += 1;
  ctx.hasTitleInCurrentPage = false;
}

function createExample(ctx) {
  const currentNode = getCurrentNode(ctx.jsxRoot);
  // eslint-disable-next-line no-use-before-define
  const component = ExampleContainer.createComponent(createPages);
  addComponentToChildren(ctx.jsxRoot, currentNode, component);

  if (ctx.jsxRoot === currentNode) {
    ctx.pageChildren.push(component);
    ctx.jsxRoot = null;
  }
}

function pargeOpenTag(ctx, textExceptTheFirstTag, node) {
  let text;
  if (textExceptTheFirstTag) {
    // Only parse the first tag name and params, textExceptTheFirstTag will be getTokensByMarkdown and insert it after current token.
    text = `<${getTheFirstTagTextContent(node.text)}>`;
  } else {
    text = node.text;
  }
  openJSX(ctx, text);
}

function parsePageContent(ctx, tokens, index) {
  const node = recursiveParseMarkedToken(tokens[index]);
  if (!node) return;

  if (node.error) {
    contract('@require 发现JSX组件\n%s\n@ensure 解析JSX文本', node.text);
    const textExceptTheFirstTag = getTextExceptTheFirstTag(node.text);
    if (isOpenTagAtBegginning(node.text)) {
      pargeOpenTag(ctx, textExceptTheFirstTag, node);
    }

    const tagName = getTagName(node.text);
    if (isExampleTag(tagName)) {
      createExample(ctx);
      return;
    }

    if (!isOpenTagAtBegginning(node.text) || isSelfCloseTag(node.text)) {
      closeJSX(ctx);
    }

    if (textExceptTheFirstTag) {
      const tokensOfTextExceptTheFirstTag = getTokensByMarkdown(textExceptTheFirstTag);
      tokens.splice(index + 1, 0, ...tokensOfTextExceptTheFirstTag);
      return;
    }
    return;
  }

  if (node.props) {
    recursiveSpliceChildren(node.props.children);
  }

  if (isParsingJSX(ctx)) {
    contract('@require JSX节点里面有MD节点 \n%O\n@ensure 把MD节点push进JSX节点', node.props);
    const currentNode = getCurrentNode(ctx.jsxRoot);
    currentNode.children.push(node);
    return;
  }

  contract('@require 独立的MD节点 \n%O\n@ensure 把MD节点push进Page节点', node.props);
  ctx.pageChildren.push(node);
}

function createPages(markdown) {
  const formattedMarkdown = addBlankLines(markdown);
  const tokens = parser(formattedMarkdown);
  modifyTokenIfMultiTagsInOneLine(tokens);

  const pages = [];
  const ctx = {
    pageChildren: [],
    jsxRoot: null,
    hasTitleInCurrentPage: false,
    currentFooter: null,
    currentPageNum: 1,
    totalPagesNum: createTotalPagesNum(tokens),
  };

  contract('@require MD \n%s\n@ensure 解析为%d个token%O', markdown, tokens.length, tokens);
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === 'hr') {
      parsePageBreak(ctx, pages);
    } else {
      parsePageContent(ctx, tokens, i);
    }
  }

  contract('@require 结束解析MD\n@ensure 把剩余节点push进Page节点');
  finishOnePage(ctx, pages);

  return pages;
}

export default createPages;
