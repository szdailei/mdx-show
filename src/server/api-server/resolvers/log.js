import { createWriteStream } from 'fs';

function log() {
  const stream = createWriteStream('append.txt', { flags: 'a' });

  [...Array(10000)].forEach((item, index) => {
    stream.write(`${index}\n`);
  });

  stream.end();
}

export default log;
