#!/usr/bin/env node
const apath = process.argv[2];
const fullPath = require('path').join(process.env.PWD, apath);

const { parseFolder } = require('./parse-folder');

parseFolder(fullPath);
