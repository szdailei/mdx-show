import { readDir, readTextFile } from '../platform';

async function fsCommand(command: string, path: string | string[]) {
  switch (command) {
    case 'readDir': {
      const data = [];
      const entries = await readDir(path as string);
      entries.forEach((entry) => {
        //! for Tauri        data.push(entries[i].path);
        data.push(entry);
      });
      data.sort();
      return data as string[];
    }
    case 'readTextFile':
      return readTextFile(path as string);
    default: {
      throw new RangeError(`Unknown command: ${command}`);
    }
  }
}

export default fsCommand;
