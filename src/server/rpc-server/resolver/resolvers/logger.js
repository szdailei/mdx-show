import { createWriteStream } from 'fs';

const logger = (params, options) => {
  const fileName = `${options.req.client.remoteAddress}${logger.loggerFileSuffix}`;
  const stream = createWriteStream(fileName, { flags: 'a' });
  stream.write(`${JSON.stringify(params)}\n`);
};

logger.loggerFileSuffix = undefined;

logger.setLoggerFileSuffix = (fileSuffix) => {
  logger.loggerFileSuffix = fileSuffix;
};

export default logger;
