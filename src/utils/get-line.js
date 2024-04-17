function indexOf(text, char, position) {
  for (let i = position, { length } = text; i < length; i += 1) {
    if (text[i] === char) return i;
  }
  return -1;
}

function getString(text, begin, end) {
  let string = '';
  for (let i = begin; i < end; i += 1) {
    string += text[i];
  }
  return string;
}

function reverseIndexOf(text, char, position) {
  for (let i = position; i >= 0; i -= 1) {
    if (text[i] === char) return i;
  }
  return -1;
}

function getLine(text, position) {
  const begin = reverseIndexOf(text, '\n', position) + 1;

  let end = indexOf(text, '\n', position);
  if (end === -1) end = text.length;

  const line = getString(text, begin, end);
  return { line, begin, end };
}

export default getLine;
