#!/usr/bin/env node
import path from 'path';
import { Worker,setEnvironmentData } from 'worker_threads';

const theScriptDir = new URL('.', import.meta.url).pathname;
const mdxShow = path.join(theScriptDir, '../mdx-show/dist/index.js')

setEnvironmentData('execArgv', process.argv) 

// eslint-disable-next-line no-new
new Worker(mdxShow);
