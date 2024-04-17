import { readDir, readTextFile } from './resolvers/files';

function getResolver(command) {
  const builtIns = [readDir, readTextFile];
  Object.defineProperty(readDir, 'name', { value: 'readDir' });
  Object.defineProperty(readTextFile, 'name', { value: 'readTextFile' });

  for (let i = 0, { length } = builtIns; i < length; i += 1) {
    const builtIn = builtIns[i];
    if (builtIn.name === command) {
      return builtIn;
    }
  }

  throw RangeError(`Invalid built-in command: ${command}`);
}

export default getResolver;
