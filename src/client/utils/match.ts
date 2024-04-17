function match(text: string, tokenOfBegin: string, tokenOfEnd: string, position: number) {
  const begin = text.indexOf(tokenOfBegin, position);
  if (begin === -1) return null;

  const end = text.indexOf(tokenOfEnd, begin);
  if (end === -1) return null;

  const range = { begin, end };
  return range;
}

export default match;
