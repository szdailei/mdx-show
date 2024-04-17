#!/usr/bin/env node

/* eslint-disable no-console */
import minimist from 'minimist';
import exportPdfs from './export-pdf.js';

const HELP = `Usage: pdfs [options]

export pdfs.

Options:
  -p, --port   Port of web. default: "3000".
  -d  --dir    Directory of exported pdfs. default: "./exported-pdfs".
  -n  --name   Mdx filename to be exported. default: "*".
  -width, --width  Width of view port. default: "1920".
  -height, --height Height of view port. default: "1080".
  -f, --format Format of paper which will override view port. default: "A4".
  -h, --help  Display help for command.`;

async function main() {
  const { argv } = process;

  const args = minimist(argv.slice(2), {
    boolean: ['help'],
    alias: {
      help: 'h',
      port: 'p',
      dir: 'd',
      name: 'n',
      width: 'width',
      height: 'height',
      format: 'f',
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

  const { port, dir, name, width, height, format } = args;
  await exportPdfs({ port, dir, name, width, height, format });
}

main();
