import { createWriteStream } from 'fs';

function logger(params,req) {
  const fileName = `${req.client.remoteAddress}-debug.log`
  const stream = createWriteStream(fileName, { flags: 'a' });
  stream.write(JSON.stringify(params));
}

logger.init = () => {};

export default logger;
