#!/usr/bin/env node
const apath = process.argv[2];
const fullPath = require('path').join(process.env.PWD, apath);
const { parseFolder } = require('./parse-folder');
const chokidar = require('chokidar');

const options = parseFolder(fullPath, true);
const watcher = chokidar.watch(fullPath, {
  ignored: [/^\./, ...options.ignores],
  persistent: true,
});

function compile() {
  parseFolder(fullPath);
}

watcher
  .on('add', path => {
    console.log('File', path, 'has been added');
    compile();
  })
  .on('change', path => {
    console.log('File', path, 'has been changed');
    compile();
  })
  .on('unlink', path => {
    console.log('File', path, 'has been removed');
    compile();
  })
  .on('error', error => {
    console.error('Error happened', error);
  });
