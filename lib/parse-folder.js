const { parseFile } = require('../lib/parse');
const path = require('path');
const fs = require('fs');

function parseIndividualFile(file, options = {}) {
  const { out = file.replace(/\.html$/, '.compiled.html') } = options;
  const html = parseFile(file);
  fs.writeFileSync(out, html);
}

function parseFolder(folder, initialFolder = folder, getOption = false) {
  let options = {
    outDir: './compiled',
    ignores: [/^partial$/, /^compiled$/, /\.compiled\.html$/],
    include: /\.html$/,
  };
  let userOptions = {};
  try {
    userOptions = JSON.parse(
      fs.readFileSync(path.join(initialFolder, 'sht.config.json')).toString(),
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
  const outDir = path.join(initialFolder, _outDir, path.relative(initialFolder, folder));
  if (getOption === true) return options;
  try {
    fs.mkdirSync(outDir);
  } catch (e) {
    // ignore
  }
  const files = fs.readdirSync(folder);
  files.forEach(filename => {
    if (ignores.some(reg => reg.test(filename))) return;
    
    const filepath = path.join(folder, filename);
    if(fs.lstatSync(filepath).isDirectory()) parseFolder(filepath, folder);
    else if (include.test(filename)) {
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