import { join } from 'path';
import { existsSync } from 'fs';
import builtinModules from 'builtin-modules';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import shell from 'shelljs';
import config from '../struc.js';
import { inputPlugins, rollupBuild } from './rollup.js';

async function cleanPdf() {
  const { outOfPdf } = { ...config };
  if (existsSync(outOfPdf)) {
    shell.rm('-rf', outOfPdf);
  }
}

async function buildPdfOfMjsFormat() {
  const { outOfPdf, srcOfTest } = { ...config };

  const nodePlugins = [...inputPlugins, json()];

  let indexOfReplace;
  for (let i = 0; i < nodePlugins.length; i += 1) {
    if (nodePlugins[i].name === 'replace') {
      indexOfReplace = i;
      break;
    }
  }

  const compileMode = process.env.NODE_ENV;
  nodePlugins[indexOfReplace] = replace({
    'process.env.NODE_ENV': JSON.stringify(compileMode),
    preventAssignment: true,
    delimiters: ['', ''],
    '#!/usr/bin/env node': '',
    'const puppeteerRootDirectory = pkgDir.sync(__dirname)':
      'const puppeteerRootDirectory = pkgDir.sync(process.cwd())',
    "const pkg = require('../../../../package.json')": "const pkg ={version:'1.0.0'}",
    "return require('debug')(prefix)": 'return (function dummmy(){})',
  });

  const inputOptions = {
    input: join(srcOfTest, 'export-pdf.js'),
    plugins: nodePlugins,
    external: builtinModules,
  };

  const outputOptions = {
    dir: outOfPdf,
    format: 'esm',
    entryFileNames: 'export-pdf.js',
  };

  await rollupBuild(inputOptions, outputOptions);
}

async function buildPdf() {
  await buildPdfOfMjsFormat();
}

export { buildPdf, cleanPdf };
