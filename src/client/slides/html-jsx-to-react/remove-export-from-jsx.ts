import { type Program, type ExportNamedDeclaration, type ExportDefaultDeclaration } from 'estree';
import * as acorn from 'acorn';
import { type Options } from 'acorn';
import acornJsx from 'acorn-jsx';

function getLineBreakCounter(text: string, position: number): number {
  let lineBreakCounter = 0;
  for (let i = 0; i < position; i += 1) {
    if (text[i] === '\n') lineBreakCounter += 1;
  }
  return lineBreakCounter;
}

function removeExportFromOneLine(line: string) {
  if (!line.startsWith('export ', 0)) {
    throw new RangeError(`There isn't export in line: ${line}`);
  }

  let jsx = '';
  const rest = line.slice(7).trim();
  if (!rest.startsWith('{', 0)) {
    if (rest.startsWith('default ', 0)) {
      const realJsx = rest.slice(8).trim();
      if (realJsx.startsWith('function') || realJsx.startsWith('async') || realJsx.startsWith('(')) {
        jsx += `${realJsx}\n`;
      }
    } else {
      jsx += `${rest}\n`;
    }
  }

  return jsx;
}

export default function removeExportFromJsx(origJsx: string) {
  const Parser = acorn.Parser.extend(acornJsx());
  const ecmaVersion: Options['ecmaVersion'] = 'latest';
  const sourceType: Options['sourceType'] = 'module';

  const options = {
    ecmaVersion,
    sourceType,
  };
  const estree = Parser.parse(origJsx, options) as unknown as Program;

  const lineBreakCounters: number[] = [];
  type Declaration = (ExportNamedDeclaration | ExportDefaultDeclaration) & {
    start: number;
  };
  estree.body.forEach((declaration: Declaration) => {
    if (declaration.type === 'ExportNamedDeclaration' || declaration.type === 'ExportDefaultDeclaration') {
      const lineBreakCounter = getLineBreakCounter(origJsx, declaration.start);
      lineBreakCounters.push(lineBreakCounter);
    }
  });

  let jsx = '';
  const lines = origJsx.split('\n');
  let lineWithExportDeclaration = lineBreakCounters.shift();
  for (let i = 0, { length } = lines; i < length; i += 1) {
    const line = lines[i].trim();
    if (i === lineWithExportDeclaration) {
      lineWithExportDeclaration = lineBreakCounters.shift();
      jsx += `${removeExportFromOneLine(line)}\n`;
    } else {
      jsx += `${line}\n`;
    }
  }
  return jsx;
}
