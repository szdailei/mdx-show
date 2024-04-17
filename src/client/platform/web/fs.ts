import rpcRequest from './rpc-request';

type ArgMatch = {
  value: null | string | boolean | string[];
};
type CliMatches = {
  args: { [name: string]: ArgMatch };
};

async function getMatches(): Promise<CliMatches> {
  return new Promise((resolve) => {
    const matchesWithDir: CliMatches = {
      args: {
        dir: {
          value: '.',
        },
      },
    };

    resolve(matchesWithDir);
  });
}

async function type(): Promise<string> {
  return new Promise((resolve) => {
    const os = navigator.userAgent;
    let finalOs = '';
    if (os.search('Windows') !== -1) {
      finalOs = 'Windows';
    } else if (os.search('Mac') !== -1) {
      finalOs = 'MacOS';
    } else if (os.search('X11') !== -1 && !(os.search('Linux') !== -1)) {
      finalOs = 'UNIX';
    } else if (os.search('Linux') !== -1 && os.search('X11') !== -1) {
      finalOs = 'Linux';
    }

    resolve(finalOs);
  });
}

type FileEntry = {
  children?: FileEntry[];
  name?: string;
  path: string;
};

function readDir(path: string) {
  const query = {
    command: 'readDir',
    params: path,
  };
  return rpcRequest(query) as Promise<FileEntry[]>;
}

function readTextFile(path: string) {
  const query = {
    command: 'readTextFile',
    params: path,
  };
  return rpcRequest(query) as Promise<string>;
}

export { getMatches, type, readDir, readTextFile };
