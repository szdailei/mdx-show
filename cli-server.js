#!/usr/bin/env node

/* eslint-disable no-console */
import { exec } from 'child_process';
import minimist from 'minimist';
// eslint-disable-next-line import/no-useless-path-segments
import server from '../mdx-show/dist/server.js';

const name = 'mdx-show';

const HELP = `Usage: mdx-show [options]

start mdx-show server and browser.

Options:
  -p, --port  Port of web. default: "3000".
  -d, --dir   Directory of md/mdx files. default: "./".
  -h, --help  Display help for command.`;

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

async function main() {
  const { argv } = process;

  const args = minimist(argv.slice(2), {
    boolean: ['help'],
    alias: {
      help: 'h',
      port: 'p',
      dir: 'd',
    },
    unknown: () => {
      console.log(HELP);
      process.exit(1);
    },
  });

  if (args.help) {
    console.log(HELP);
    process.exit(0);
  }

  const { port, dir } = args;
  const actualPort = await server({ port, dir, name });

  const url = `http://localhost:${actualPort}`;
  openUrl(url);
}

main();
