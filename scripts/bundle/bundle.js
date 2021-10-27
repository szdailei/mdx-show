import minimist from 'minimist';
import log from 'loglevel';
import shell from 'shelljs';
import { getStructure } from '../structure.js';
import HELP from './HELP.js';
import bundleServers from './bundle-servers.js';

(async () => {
  const args = minimist(process.argv.slice(2), {
    boolean: ['help'],
    alias: {
      help: 'h',
    },
  });

  if (args.help || process.argv.length > 2) {
    log.warn(HELP);
    process.exit(0);
  }

  const { readme, example, dest } = await getStructure();
  shell.cp(readme, dest);
  shell.cp(example, dest);
  bundleServers(dest);
})();
