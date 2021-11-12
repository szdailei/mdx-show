import { join } from 'path';
import chokidar from 'chokidar';
import { getStructure } from '../structure.js';
import { buildApp, cleanApp } from '../rollup/build-app.js';
import { buildServer, cleanServer } from '../rollup/build-server.js';
import Complier from './Complier.js';

const timeout = 1000;

function isMatched(changedPath, path) {
  for (let i = 0; i < path.length; i += 1) {
    if (changedPath.indexOf(path[i]) === 0) {
      return true;
    }
  }
  return false;
}

async function watch() {
  const { root, srcOfClient, srcOfServer, srcOfDebug } = await getStructure();

  const options = {
    changed: false,
    requireCompile: false,
    idleCount: 0,
    compiling: false,
    compiled: false,
  };

  const clientComplier = new Complier('client', [srcOfClient, srcOfDebug], cleanApp, buildApp, { ...options });
  const serverComplier = new Complier('server', [srcOfServer, srcOfDebug], cleanServer, buildServer, { ...options });

  const compilers = [clientComplier, serverComplier];

  function period() {
    compilers.forEach((compiler) => {
      compiler.period(period);
    });
    setTimeout(period, timeout);
  }

  setTimeout(period, timeout);

  chokidar.watch('./src').on('all', async (_, relativeChangedPath) => {
    const changedPath = join(root, relativeChangedPath);
    compilers.forEach((compiler) => {
      if (isMatched(changedPath, compiler.path)) {
        // eslint-disable-next-line no-param-reassign
        compiler.options.changed = true;
      }
    });
  });
}

export default watch;
