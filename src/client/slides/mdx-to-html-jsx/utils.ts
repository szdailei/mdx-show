import match from '../../utils/match';

export function getTagName(html: string) {
  const range = match(html, '<', '>', 0);
  if (!range) return null;

  const tag = html.slice(range.begin + 1, range.end);
  const fields = tag.split(' ');
  if (fields[0][0] === '/') return fields[0].slice(1);

  return fields[0];
}

function isCodeMarker(line: string) {
  return line.startsWith('```');
}

function isTagAtLineBeginning(text: string) {
  return text[0] === '<';
}

export function addBlankLineAroundTagAndTrimInside(mdx: string) {
  const lines = mdx.split('\n');
  const { length } = lines;

  let minified = lines[0];
  let isInsideCode = isCodeMarker(minified);
  if (!isInsideCode && isTagAtLineBeginning(minified.trim())) {
    minified = `\n${minified}\n\n`;
  }

  for (let i = 1; i < length; i += 1) {
    const line = lines[i];
    if (isCodeMarker(line)) {
      if (!isInsideCode) {
        minified += '\n';
      }
      isInsideCode = !isInsideCode;
    }

    if (isInsideCode) {
      minified += `\n${line}`;
    } else if (isTagAtLineBeginning(line.trim())) {
      minified += `\n\n${line.trim()}\n`;
    } else {
      minified += `\n${line}`;
    }
  }
  return minified;
}
