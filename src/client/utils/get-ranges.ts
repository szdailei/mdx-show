import match from './match';

type Range = {
  begin: number;
  end: number;
};

function getRanges(text: string, tokenOfBegin: string, tokenOfEnd: string) {
  const ranges: Range[] = [];
  let position = 0;

  for (;;) {
    const range = match(text, tokenOfBegin, tokenOfEnd, position);
    if (!range) return ranges;

    ranges.push(range);
    position = range.end;
  }
}

export default getRanges;
