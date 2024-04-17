#!/usr/bin/env node

import build, { help, clean } from './build.js';

const { argv } = process;
const production = argv[2] === 'prod';
const watch = argv[2] === 'watch';
process.env.NODE_ENV = production ? 'production' : 'development';

if (argv.length < 3 || !['clean', 'prod', 'dev', 'watch'].includes(argv[2])) {
  help();
  process.exit(1);
}

if (argv[2] === 'clean') {
  clean();
  process.exit(0);
}

if (production) {
  clean();
}

build(production, watch);
