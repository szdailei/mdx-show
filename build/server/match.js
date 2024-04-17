import getLine from '../../src/utils/get-line.js';

function match(text, token1, token2, position) {
  const index = text.indexOf(token1, position);
  if (index === -1) return null;

  const { line, begin, end } = getLine(text, index);
  if (line.trim().startsWith(token1)) {
    const conditionLine = line.trim().slice(token1.length);
    if (conditionLine.trim().startsWith(token2)) {
      return { begin, end };
    }
  }

  return match(text, token1, token2, end);
}
export default match;
