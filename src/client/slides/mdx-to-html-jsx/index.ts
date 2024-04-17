import * as acorn from 'acorn';
import { type Acorn } from 'micromark-extension-mdxjs-esm/lib/syntax';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import { mdxjsEsm } from 'micromark-extension-mdxjs-esm';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxjsEsmFromMarkdown } from 'mdast-util-mdxjs-esm';
import { preProcessToAddBlankLines, preProcessForVoidTagAndInsideHtml } from './pre-process';

type Modify = {
  begin: number;
  end: number;
  newText: string;
};

type Ctx = {
  mdx: string;
  importedFiles: string[];
  modifies: Modify[];
  jsxCode: string;
  title: string | null;
};

function toUnixFormat(rawText: string) {
  let text = '';
  const lines = rawText.split('\r\n');
  const { length } = lines;
  for (let i = 0; i < length - 1; i += 1) {
    text += `${lines[i]}\n`;
  }
  text += lines[length - 1];
  return text;
}

function modifyMdx(mdx: string, modifies: Modify[]) {
  if (modifies.length === 0) return mdx;

  let modifiedMdx = '';
  let start = 0;
  for (let i = 0, { length } = modifies; i < length; i += 1) {
    const modify = modifies[i];
    const position = modify.begin;
    const end = i === length - 1 ? mdx.length : modifies[i + 1].begin;
    const stringBeforeBegin = mdx.slice(start, position);
    const stringAfterEnd = mdx.slice(modify.end, end);
    modifiedMdx += `${stringBeforeBegin}${modify.newText}${stringAfterEnd}`;
    start = end;
  }

  return modifiedMdx;
}

function addBlankLinesAroundCodeBlock(mdx: string) {
  const lines = mdx.split('\n');
  let result = '';
  let isInsideCode = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith('```')) {
      isInsideCode = !isInsideCode;
      if (isInsideCode) {
        result += `\n${line}\n`;
      } else {
        result += `${line}\n\n`;
      }
    } else {
      result += `${line}\n`;
    }
  }
  return result;
}

function mdxToHtmlJsx(origMdx: string) {
  const mdxWithoutBlankLineAroundCodeBlock = toUnixFormat(origMdx);
  const mdx = addBlankLinesAroundCodeBlock(mdxWithoutBlankLineAroundCodeBlock);

  const mdxjsParser = acorn as unknown as Acorn;
  let mdast = fromMarkdown(mdx, {
    extensions: [mdxjsEsm({ acorn: mdxjsParser, addResult: true })],
    mdastExtensions: [mdxjsEsmFromMarkdown],
  });

  const ctx: Ctx = {
    mdx,
    importedFiles: [],
    modifies: [],
    jsxCode: '',
    title: null,
  };

  preProcessToAddBlankLines(ctx, mdast.children);

  const { jsxCode } = ctx;
  const mdxWithBlankLineAroundTag = modifyMdx(mdx, ctx.modifies);

  mdast = fromMarkdown(mdxWithBlankLineAroundTag);
  ctx.mdx = mdxWithBlankLineAroundTag;
  ctx.modifies = [];
  preProcessForVoidTagAndInsideHtml(ctx, mdast.children);
  const mdxWithParsedInsideHtml = modifyMdx(mdxWithBlankLineAroundTag, ctx.modifies);

  const html = micromark(mdxWithParsedInsideHtml, {
    allowDangerousHtml: true,
    allowDangerousProtocol: true,
    extensions: [gfm(), mdxjsEsm({ acorn: mdxjsParser })],
    htmlExtensions: [gfmHtml()],
  });

  const { importedFiles, title } = ctx;

  return { importedFiles, jsxCode, html, title };
}

export default mdxToHtmlJsx;
