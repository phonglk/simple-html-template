const { parseFile } = require('../lib/parse');
const path = require('path');
const fs = require('fs');

function parseIndividualFile(file, options = {}) {
  const { out = file.replace(/\.html$/, '.compiled.html') } = options;
  const html = parseFile(file);
  fs.writeFileSync(out, html);
}

function parseFolder(folder) {
  let options = {};
  try {
    options = JSON.parse(fs.readFileSync(path.join(folder, 'sht.config.json')).toString());
  } catch (e) {
    // ignore
  }
  const {
    outDir: _outDir = './compiled',
    ignores = [/^partial$/, /^compiled$/, /\.compiled\.html$/],
    include = /\.html$/,
  } = options;
  const outDir = path.join(folder, _outDir);
  try {
    fs.mkdirSync(outDir);
  } catch (e) {
    // ignore
  }
  const files = fs.readdirSync(folder);
  files.forEach((filename) => {
    if (ignores.some(reg => reg.test(filename))) return;
    if (include.test(filename)) {
      const filepath = path.join(folder, filename);
      const out = path.join(outDir, filename);
      parseIndividualFile(filepath, { out });
    }
  });
  return true;
}

module.exports = {
  parseIndividualFile,
  parseFolder,
};
