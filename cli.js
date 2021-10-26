#!/usr/bin/env node
import { Worker } from 'worker_threads';
import cliTitle from './src/cli-title.js';

const mdxShow = './dist/index.js';

process.title = cliTitle;
process.env.CLI_ARGV = process.argv
// eslint-disable-next-line no-new
new Worker(mdxShow);
