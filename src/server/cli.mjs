#!/usr/bin/env node

/* eslint-disable no-console */
import { exec } from 'child_process';
import minimist from 'minimist';
import startServer from './start-server';

// eslint-disable-next-line no-unused-vars
function openUrl(url) {
  let cmd;
  switch (process.platform) {
    case 'darwin':
      cmd = 'open';
      break;
    case 'win32':
      cmd = 'explorer.exe';
      break;
    case 'linux':
      cmd = 'xdg-open';
      break;
    default:
      throw new RangeError(`Unsupported platform: ${process.platform}`);
  }
  exec(`${cmd} "${url}"`);
}

(async () => {
  const HELP = `Usage: mdx-show [options]
  
  start mdx-show server and browser.
  
  Options:
    -c, --client  Directory of index.html. default: "./".
    -p, --port  Port of web. default: "3000".
    -d, --dir   Directory of md/mdx files. default: "./".
    -h, --help  Display help for command.`;

  const { argv } = process;

  const args = minimist(argv.slice(2), {
    boolean: ['help'],
    alias: {
      help: 'h',
      client: 'c',
      port: 'p',
      dir: 'd',
    },
    unknown: () => {
      console.error(HELP);
      process.exit(1);
    },
  });

  if (args.help) {
    console.log(HELP);
    process.exit(0);
  }

  const { client, port, dir } = args;
  await startServer({ client, port, dir, name: 'mdx-show' });

  //  const url = `http://localhost:${actualPort}`;
  //  openUrl(url);
})();
