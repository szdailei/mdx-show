#!/usr/bin/env node

/* eslint-disable no-console */
import { exec } from 'child_process';
import minimist from 'minimist';
import server from './dist/server.js';

const name = 'mdx-show';

const HELP = `Usage: mdx-show [options]

start mdx-show server and browser.

Options:
  -p, --port  Port of web. default: "3000".
  -s, --storage  Directory of storage files. default: "./".
  -w, --web   Directory of index.html. default: "{server-dir}/web".
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
      web: 'w',
      storage: 's',
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

  const { port, web, storage } = args;
  const actualPort = await server({ port, web, storage, name });

  const url = `http://localhost:${actualPort}`;
  //  openUrl(url);
}

main();
