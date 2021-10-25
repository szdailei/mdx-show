import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import shell from 'shelljs';
import { getStructure } from '../../structure';
import inline from './inline';

const mode = process.env.NODE_ENV;
const plugins = [
  nodeResolve({ extensions: ['.mjs', '.js', '.jsx'], preferBuiltins: false }),
  babel({
    babelHelpers: 'bundled',
    presets: [['@babel/preset-env', { targets: { chrome: 86 } }], '@babel/preset-react'],
    include: ['../**/src/**'],
    extensions: ['.jsx', '.tsx'],
  }),
  replace({ 'process.env.NODE_ENV': JSON.stringify(mode), preventAssignment: true }),
  external(),
  json(),
  postcss({
    plugins: [],
  }),
  commonjs(),
];

async function build(inputOptions, outputOptions) {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
  await bundle.close();
}

(async () => {
  const { dest, destOfWeb, src, srcOfClient, srcOfWeb } = await getStructure();

  shell.rm('-rf', dest);
  shell.mkdir(dest, destOfWeb);

  const inputOptions = {
    input: path.join(src, 'start.js'),
    plugins,
  };
  const outputOptions = {
    dir: dest,
    format: 'esm',
    entryFileNames: 'index.js',
    chunkFileNames: '[name]-[hash].js',
  };
  await build(inputOptions, outputOptions);

  shell.cp('-R', srcOfWeb, destOfWeb);

  inputOptions.input = path.join(srcOfClient, 'local-app.jsx');
  outputOptions.dir = destOfWeb;
  outputOptions.entryFileNames = 'app.js';
  await build(inputOptions, outputOptions);
  inline(path.join(destOfWeb, 'index.html'), path.join(dest, 'mdx-show.html'));

  inputOptions.input = path.join(srcOfClient, 'www-app.jsx');
  outputOptions.dir = destOfWeb;
  outputOptions.entryFileNames = 'app.js';
  await build(inputOptions, outputOptions);
})();
