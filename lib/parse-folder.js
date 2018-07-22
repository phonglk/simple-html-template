const { parseFile } = require('../lib/parse');
const path = require('path');
const fs = require('fs');

function parseIndividualFile(file, options = {}) {
  const { out = file.replace(/\.html$/, '.compiled.html') } = options;
  const html = parseFile(file);
  fs.writeFileSync(out, html);
}

function parseFolder(folder, getOption = false) {
  let options = {
    outDir: './compiled',
    ignores: [/^partial$/, /^compiled$/, /\.compiled\.html$/],
    include: /\.html$/,
  };
  let userOptions = {};
  try {
    userOptions = JSON.parse(
      fs.readFileSync(path.join(folder, 'sht.config.json')).toString(),
    );
  } catch (e) {
    userOptions = {};
    // ignore
  }
  options = {
    ...options,
    ...userOptions,
  };
  const { outDir: _outDir, ignores, include } = options;
  const outDir = path.join(folder, _outDir);
  if (getOption === true) return options;
  try {
    fs.mkdirSync(outDir);
  } catch (e) {
    // ignore
  }
  const files = fs.readdirSync(folder);
  files.forEach(filename => {
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
