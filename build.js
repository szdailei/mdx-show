#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs';
import { build } from 'esbuild';
import struc from './scripts/struc.js';
import bundleClient from './scripts/client/bundle-client.js';
import bundleServer from './scripts/server/bundle-server.js';
import serve from './scripts/server/serve.js';

function removeDir(out) {
  if (fs.existsSync(out)) {
    fs.rmSync(out, { recursive: true, force: true });
  }
  console.log(`${out} is removed`);
}

function clean() {
  const { outOfClient, outOfServer, outOfPdf } = struc;
  removeDir(outOfClient);
  removeDir(outOfServer);
  removeDir(outOfPdf);
}

function mkdir(out) {
  if (!fs.existsSync(out)) {
    fs.mkdirSync(out, { recursive: true });
  }
}

function prepare() {
  const { outOfClient, outOfServer, outOfPdf } = struc;
  mkdir(outOfClient);
  mkdir(outOfServer);
  mkdir(outOfPdf);
}

function help() {
  const HELP = `Usage: build command

  command:
  clean   Remove out dir.
  prod    Build for production.
  dev     Build for development.
  watch   Build and serve.
  `;
  console.log(HELP);
}

const { argv } = process;
const production = argv[2] === 'prod';
const watch = argv[2] === 'watch';
process.env.NODE_ENV = production ? 'production' : 'development';

function createValueOfWatch(bundle) {
  const valueOfWatch = {
    onRebuild(error, result) {
      if (error) {
        console.error(error.message);
      } else {
        bundle(result, struc, production);
      }
    },
  };
  return valueOfWatch;
}

if (argv.length < 3 || !['clean', 'prod', 'dev', 'watch'].includes(argv[2])) {
  help();
  process.exit(0);
}

if (argv[2] === 'clean') {
  clean();
  process.exit(0);
}

const commonOptions = {
  bundle: true,
  format: 'esm',
  write: false, // to run custom bundle
  sourcemap: !production,
  treeShaking: true,
};

const optionsOfClient = {
  ...commonOptions,
  watch: watch ? createValueOfWatch(bundleClient) : false,
  platform: 'browser',
  entryPoints: [struc.entryPointOfClient],
  outdir: struc.outOfClient,
  entryNames: '[dir]/[name].[hash]',
  splitting: true,
  chunkNames: '[name].[hash]',
  jsx: 'automatic', //  to override  "jsx" setting in tsconfig.json
  minify: production,
};

const optionsOfServer = {
  ...commonOptions,
  watch: watch ? createValueOfWatch(bundleServer) : false,
  platform: 'node',
  entryPoints: [struc.entryPointOfServer],
  outdir: struc.outOfServer,
  legalComments: 'inline', // for run custom conditional compile in bundler
  define: { NODE_ENV_PRODUCTION: production ? 'true' : 'false' },
  minifySyntax: true, // to remove dead code
};

const optionsOfPdf = {
  ...commonOptions,
  platform: 'node',
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
  entryPoints: [struc.entryPointOfPdf],
  outdir: struc.outOfPdf,
  minify: false,
  write: true,
};

prepare();

build(optionsOfClient).then((result) => {
  bundleClient(result, struc, production);
});

build(optionsOfServer).then((result) => {
  bundleServer(result, struc, production);
});

build(optionsOfPdf);

if (watch) {
  serve(struc);
}
