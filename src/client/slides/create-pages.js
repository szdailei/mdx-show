import { parser } from '../markdown/index.js';
import debug from '../debug/debug.js';
import {
  addBlankLinesAndRemoveIntent,
  modifyTokenIfMultiTagsInOneLine,
  isOpenTagAtBegginning,
  isSelfCloseTag,
  getTagName,
  getParams,
  getTheFirstTagTextContent,
  getTextExceptTheFirstTag,
} from './parse-jsx-utils.js';
import recursiveParseMarkedToken from './recursive-parse-marked-token.js';
import { isParsingJSX, getTokensByMarkdown, openJSX, closeJSX, recursiveSpliceChildren } from './parse-jsx.js';
import { getCurrentNode, addComponentToChildren } from './tree.js';
import { defaultTheme, isThemeTag } from './theme.js';
import Page from './Page.jsx';
import Example, { isExampleTag } from './Example.jsx';

function noUse() {}
const contract = noUse;

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
  const component = Example.createComponent(createPages);
  addComponentToChildren(ctx.jsxRoot, currentNode, component);

  if (ctx.jsxRoot === currentNode) {
    ctx.pageChildren.push(component);
    ctx.jsxRoot = null;
  }
}

function createTheme(ctx, text) {
  ctx.theme = {
    ...ctx.theme,
    ...getParams(text),
  };
  ctx.jsxRoot = null;
}

function parseOpenTag(ctx, textExceptTheFirstTag, node) {
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
  const options = {
    parent: null,
    listDepth: 0,
  };

  const node = recursiveParseMarkedToken(tokens[index], options);
  if (!node) return;

  if (node.error) {
    contract('@require 发现JSX组件\n%s\n@ensure 解析JSX文本', node.text);
    const textExceptTheFirstTag = getTextExceptTheFirstTag(node.text);
    if (isOpenTagAtBegginning(node.text)) {
      parseOpenTag(ctx, textExceptTheFirstTag, node);
    }

    const tagName = getTagName(node.text);
    if (isExampleTag(tagName)) {
      createExample(ctx);
      return;
    }

    if (isThemeTag(tagName)) {
      createTheme(ctx, node.text);
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
  const formattedMarkdown = addBlankLinesAndRemoveIntent(markdown);
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
    theme: defaultTheme,
  };

  debug(markdown);

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

  const { theme } = ctx;
  return { pages, theme };
}

export default createPages;
