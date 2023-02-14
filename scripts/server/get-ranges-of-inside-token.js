import match from './match.js';

function getRangeOfInsideToken(text, tokenOfSearch, tokenOfBegin, tokenOfEnd, position) {
  const indexOfBegin = match(text, tokenOfSearch, tokenOfBegin, position);

  if (!indexOfBegin) return null;

  const indexOfEnd = match(text, tokenOfSearch, tokenOfEnd, indexOfBegin.end);

  if (!indexOfEnd) throw RangeError(`Found tokenOfBegin, but miss tokenOfend:\n${indexOfBegin.line}`);

  return { begin: indexOfBegin.begin, end: indexOfEnd.end };
}

function getRangesOfInsideToken(text, tokenOfComment, tokenOfConditionBegin, tokenOfContionEnd) {
  const ranges = [];
  let position = 0;

  for (;;) {
    const range = getRangeOfInsideToken(text, tokenOfComment, tokenOfConditionBegin, tokenOfContionEnd, position);
    if (!range) return ranges;

    ranges.push(range);
    position = range.end;
  }
}

export default getRangesOfInsideToken;
