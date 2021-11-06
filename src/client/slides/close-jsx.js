import trim from './trim.js';
import { isCloseTagAtBeginning, getTextExceptTheFirstTag, isHtmlTag } from './parse-jsx-utils.js';
import { getCurrentNode, addComponentToChildren } from './tree.js';
import MDXToReactHOC from './MDXToReactHOC.jsx';
import ReactHOC from './ReactHOC.jsx';

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

export { closeJSX, closeMultiJSXsInOneLine };
