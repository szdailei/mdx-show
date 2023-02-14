import React, { type HTMLAttributes } from 'react';
import type { CreatedNode } from '../../slides/html-jsx-to-react/index.d';
import makeid from '../../utils/makeid';

function getRange(text: string) {
  const beginAndEnd = text.split('-');
  if (beginAndEnd.length === 1) {
    const [begin] = beginAndEnd;
    const end = begin;
    return { begin: Number(begin), end: Number(end) };
  }

  const [begin, end] = beginAndEnd;
  return { begin: Number(begin), end: Number(end) };
}

function getLineNumbers(text: string) {
  const range = getRange(text);
  const lineNumbers: number[] = [];
  for (let i = range.begin; i < range.end + 1; i += 1) {
    lineNumbers.push(i);
  }
  return lineNumbers;
}

function getAllLineNumbers(dataLine: string) {
  const fields = dataLine.split(',');
  const allLineNumbers: number[] = [];
  for (let i = 0, { length } = fields; i < length; i += 1) {
    const field = fields[i];
    const numbers = getLineNumbers(field);
    for (let j = 0, numbersLength = numbers.length; j < numbersLength; j += 1) {
      allLineNumbers.push(numbers[j]);
    }
  }
  return allLineNumbers;
}

export function parseLanguage(language: string | null) {
  let lang = 'language-jsx';
  let dataLine = '';

  if (!language || language.trim() === '') {
    return { lang, dataLine };
  }

  const indexOfLeftBracket = language.indexOf('{');
  if (indexOfLeftBracket === -1) {
    lang = language.trim();
    return { lang, dataLine };
  }

  const left = language.slice(0, indexOfLeftBracket).trim();
  if (left.length > 'language-'.length) {
    lang = left;
  }

  const indexOfRightBracket = language.indexOf('}');
  if (indexOfRightBracket === -1) return { lang, dataLine };

  dataLine = language.slice(indexOfLeftBracket + 1, indexOfRightBracket).trim();
  return { lang, dataLine };
}

function createCode(code: string, lang: string, isHighLight: boolean) {
  const style = isHighLight
    ? {
        color: 'black',
        backgroundColor: 'white',
      }
    : undefined;

  const createdNode = (
    <code key={makeid()} className={lang} style={style}>
      {code}
    </code>
  );
  return createdNode;
}

function createCodes(codes: CreatedNode[], code: string, lang: string, dataLine: string) {
  let allLineNumbers: number[] = [];
  if (dataLine) {
    allLineNumbers = getAllLineNumbers(dataLine);
  }

  const lines = code.split('\n');
  let createdCode: CreatedNode;
  let isHighLight = allLineNumbers.includes(1);
  createdCode = createCode(lines[0], lang, isHighLight);
  codes.push(createdCode);
  for (let i = 1, { length } = lines; i < length; i += 1) {
    isHighLight = allLineNumbers.includes(i + 1);
    createdCode = createCode('\n', lang, false);
    codes.push(createdCode);
    createdCode = createCode(`${lines[i]}`, lang, isHighLight);
    codes.push(createdCode);
  }
}

function Code(props: HTMLAttributes<HTMLPreElement>) {
  const codes: CreatedNode[] = [];
  const { children } = props;
  const { lang, dataLine } = parseLanguage(props.className);
  createCodes(codes, children as string, lang, dataLine);
  return codes;
}

export default Code;
