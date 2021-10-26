import path from 'path';
import minimist from 'minimist';
import { defaultVars, getApiServerPort, getDownloadServerPort } from '../default-vars.js';
import log from './log.js';
import start from './start.js';
import HELP from './HELP.js';
import VERSION from './VERSION.js';

async function mdxShow(argv) {
  const theScriptDir = new URL('.', import.meta.url).pathname;
  const theWorkingDir = process.cwd();

  const args = minimist(argv.slice(2), {
    boolean: ['version', 'help'],
    alias: {
      help: 'h',
      version: 'v',
      port: 'p',
      web: 'w',
      mdx: 'm',
    },
    default: {
      port: defaultVars.port,
      web: path.join(theScriptDir, defaultVars.webRoot),
      mdx: path.join(theWorkingDir, defaultVars.mdxRoot),
    },
    unknown: () => {
      log.error(HELP);
      process.exit(1);
    },
  });

  if (args.help) {
    log.warn(HELP);
    process.exit(0);
  }

  if (args.version) {
    log.warn(VERSION);
    process.exit(0);
  }

  const staticServerPort = args.port;
  const apiServerPort = getApiServerPort(staticServerPort);

  const staticRoot = path.isAbsolute(args.web) ? args.web : path.join(theWorkingDir, args.web);
  const storageRoot = path.isAbsolute(args.mdx) ? args.mdx : path.join(theWorkingDir, args.mdx);

  const downloadServerPort = getDownloadServerPort(staticServerPort);

  start({ staticRoot, storageRoot, staticServerPort, apiServerPort, downloadServerPort });
}

export default mdxShow;
