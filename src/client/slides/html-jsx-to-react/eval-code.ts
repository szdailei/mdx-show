import getRanges from '../../utils/get-ranges';

export function isVariable(value: string) {
  const firstLetter = value.slice(0, 1);
  return firstLetter === '{';
}

function getResultOfEval(codeForEval: string, errMsg: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const resultOfEval = new Function(codeForEval)() as string;
    return resultOfEval;
  } catch (error) {
    const errorOfEvalMsg = error instanceof Error ? error.message : String(error);
    throw new RangeError(`${errorOfEvalMsg}\nFailed to eval "${errMsg}"`);
  }
}

export function removeParantheses(expression: string) {
  const lastIndex = expression.indexOf('}');
  const variable = expression.slice(1, lastIndex);
  return variable;
}

export function evalVariable(variable: string, jsCode?: string) {
  if (!jsCode || !isVariable(variable)) return variable;

  const variableWithoutParantheses = removeParantheses(variable);
  const codeForEval = `${jsCode}\nreturn ${variableWithoutParantheses}`;

  return getResultOfEval(codeForEval, variable);
}

export function evalTextNode(text: string, jsCode?: string) {
  if (!jsCode) return text;

  const ranges = getRanges(text, '{', '}');
  if (ranges.length === 0) return text;

  let templateString = '`';
  let start = 0;
  for (let i = 0, { length } = ranges; i < length; i += 1) {
    const positionOfLeftParentheses = ranges[i].begin;
    const end = i === length - 1 ? text.length : ranges[i + 1].begin;
    const stringBeforeLeftParentheses = text.slice(start, positionOfLeftParentheses);
    const stringAfterLeftParentheses = text.slice(positionOfLeftParentheses, end);
    templateString += `${stringBeforeLeftParentheses}$${stringAfterLeftParentheses}`;
    start = end;
  }
  templateString += '`';

  const codeForEval = `${jsCode}\nreturn ${templateString}`;
  return getResultOfEval(codeForEval, text);
}
