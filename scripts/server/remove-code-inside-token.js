import getRangesOfInsideToken from './get-ranges-of-inside-token.js';

function removeCodeInsideToken(text, tokenOfComment, tokenOfConditionBegin, tokenOfConditionEnd) {
  const rangesOfInside = getRangesOfInsideToken(text, tokenOfComment, tokenOfConditionBegin, tokenOfConditionEnd);

  if (rangesOfInside.length === 0) return text;

  const rangesOfOutside = [];
  let begin = 0;
  rangesOfInside.forEach((indexOfToken) => {
    const rangeOfOutside = { begin, end: indexOfToken.begin };
    begin = indexOfToken.end + 1;
    rangesOfOutside.push(rangeOfOutside);
  });
  const last = {
    begin: rangesOfInside[rangesOfInside.length - 1].end + 1,
    end: text.length,
  };
  rangesOfOutside.push(last);

  let code = '';
  for (let i = 0, { length } = rangesOfOutside; i < length; i += 1) {
    const slice = text.slice(rangesOfOutside[i].begin, rangesOfOutside[i].end);
    code += slice;
  }
  return code;
}

export default removeCodeInsideToken;
