/* eslint-disable no-console */
import fs from 'fs';
import { build as esbuild } from 'esbuild';
import struc from './struc.js';
import bundleClient from './client/bundle-client.js';
import bundleServer from './server/bundle-server.js';
import bundlePdf from './pdf/bundle-pdf.js';
import serve from './server/serve.js';

export function help() {
  const HELP = `Usage: build command

  command:
  clean   Remove out dir.
  prod    Build for production.
  dev     Build for development.
  watch   Build and serve.
  `;
  console.log(HELP);
}

function removeDir(out) {
  if (fs.existsSync(out)) {
    fs.rmSync(out, { recursive: true, force: true });
  }
  console.log(`${out} is removed`);
}

export function clean() {
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

function createValueOfWatch(bundle) {
  const valueOfWatch = {
    onRebuild(error, result) {
      if (error) {
        console.error(error.message);
      } else {
        bundle(result, struc, false);
      }
    },
  };
  return valueOfWatch;
}

function build(production, watch) {
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
  };

  prepare();

  esbuild(optionsOfClient).then((result) => {
    bundleClient(result, struc, production);
  });

  esbuild(optionsOfServer).then((result) => {
    bundleServer(result, struc, production);
  });

  esbuild(optionsOfPdf).then((result) => {
    bundlePdf(result);
  });

  if (watch) {
    serve(struc);
  }
}

export default build;
