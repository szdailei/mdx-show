import { trim } from '../lib/markdown';
import { isCloseTagAtBeginning, getTextExceptTheFirstTag } from './parse-jsx-utils';
import { getCurrentNode, addComponentToChildren } from './tree';
import MDXToReactHOC from './MDXToReactHOC';

function closeJSX(ctx) {
  const currentNode = getCurrentNode(ctx.jsxRoot);
  if (currentNode.tagName === 'Title') {
    ctx.hasTitleInCurrentPage = true;
  }

  const component = MDXToReactHOC.createComponent(currentNode);
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
