import * as htmlparser2 from 'htmlparser2';
import { micromark } from 'micromark';
import { gfmHtml } from 'micromark-extension-gfm';
import match from '../../utils/match';
import getLine from '../../../utils/get-line';
import { addBlankLineAroundTagAndTrimInside, getTagName } from './utils';

function attribsToString(attribs) {
  const keys = Object.keys(attribs);
  let attribsString = '';

  keys.forEach((key) => {
    const value = attribs[key];
    attribsString += ` ${key}="${value}"`;
  });
  return attribsString;
}

function removeIndentation(fakeCode) {
  const lines = fakeCode.split('\n');
  const { length } = lines;
  let realMdx = lines[0].trim();
  for (let i = 1; i < length; i += 1) {
    const line = lines[i];
    realMdx += `\n${line.trim()}`;
  }
  return realMdx;
}

function preProcessVoidTag(ctx, tagName, value, begin, end) {
  const firstLetter = tagName[0];
  const isReactTag = firstLetter.toUpperCase() === firstLetter;
  if (!isReactTag) return false;

  const range = match(value, '<', '>', 0);
  const firstTag = value.slice(range.begin, range.end + 1);
  const lastTwoCharsOfFirstTag = firstTag.slice(value.length - 2);
  if (lastTwoCharsOfFirstTag !== '/>') return false;

  const firstTagWithoutLastTwoChars = firstTag.slice(range.begin, range.end - 1);
  const newText = `${firstTagWithoutLastTwoChars}></${tagName}>`;
  const modify = { begin, end, newText };
  ctx.modifies.push(modify);
  return true;
}

export function preProcessToAddBlankLines(ctx, children) {
  children.forEach((child) => {
    if (child.children) {
      preProcessToAddBlankLines(ctx, child.children);
    }

    if (child.type === 'mdxjsEsm') {
      // import line and jsx code
      const { body } = child.data.estree;
      for (let j = 0, lengthOfBody = body.length; j < lengthOfBody; j += 1) {
        if (body[j].type === 'ImportDeclaration') {
          ctx.importedFiles.push(body[j].source.value);
        } else {
          const name = body[j].declaration.declarations[0].id.name.toLowerCase();
          if (name === 'title') {
            ctx.title = body[j].declaration.declarations[0].init.value;
          }
          const { start, end } = body[j].declaration;
          const declaration = ctx.mdx.slice(start, end);
          ctx.jsxCode += `${declaration}\n`;
        }
      }
      return;
    }

    if (child.type === 'html') {
      // html block
      const tagName = getTagName(child.value);
      if (tagName === 'pre' || tagName === 'code') return;

      const begin = Number(child.position.start.offset);
      const end = Number(child.position.end.offset);

      const isPreProcessed = preProcessVoidTag(ctx, tagName, child.value, begin, end);
      if (isPreProcessed) return;

      const { line } = getLine(ctx.mdx, begin);
      const range = match(line, '<', '>', 0);
      if (!range) return;

      const textBeforeTag = line.slice(0, range.begin);
      if (textBeforeTag.trim().length > 0) return;

      const newText = addBlankLineAroundTagAndTrimInside(child.value);
      const modify = { begin, end, newText };
      ctx.modifies.push(modify);
      return;
    }

    if (child.type === 'code') {
      // markdown code block which start with ```
      const begin = Number(child.position.start.offset);
      const end = Number(child.position.end.offset);
      const code = ctx.mdx.slice(begin, end);
      if (code.startsWith('```')) return;

      // indented text should be considered as normal markdown, not code block
      // NOTE: this is not compliance with common markdown standards
      const realMdx = removeIndentation(code);
      const newText = addBlankLineAroundTagAndTrimInside(realMdx);
      const modify = { begin, end, newText };
      ctx.modifies.push(modify);
    }

    // default is markdown block, not preProcessed
  });
}

export function preProcessForVoidTagAndInsideHtml(ctx, children) {
  children.forEach((child) => {
    if (child.children) {
      preProcessForVoidTagAndInsideHtml(ctx, child.children);
    }

    if (child.type !== 'html') return;
    const tagName = getTagName(child.value);
    if (tagName === 'pre' || tagName === 'code') return;

    const begin = Number(child.position.start.offset);
    const end = Number(child.position.end.offset);

    const isPreProcessed = preProcessVoidTag(ctx, tagName, child.value, begin, end);
    if (isPreProcessed) return;

    const options = { lowerCaseTags: false, lowerCaseAttributeNames: false };
    const doc = htmlparser2.parseDocument(child.value.trim(), options);
    if (doc.children.length !== 1 || !doc.children[0].children || doc.children[0].children.length !== 1) return;

    const { data } = doc.children[0].children[0];
    const node = doc.children[0];
    const attrs = attribsToString(node.attribs);
    const html = micromark(data, {
      allowDangerousHtml: true,
      allowDangerousProtocol: true,
      htmlExtensions: [gfmHtml()],
    });
    const newText = `<${node.name}${attrs}>${html}</${node.name}>`;
    const modify = { begin, end, newText };
    ctx.modifies.push(modify);
  });
}
