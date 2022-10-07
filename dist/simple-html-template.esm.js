import path from 'path';
import fs from 'fs';
import { parse, walk, SyntaxKind } from 'html5parser';

var config = /*#__PURE__*/require('rc')('sht', {
  outDir: './compiled',
  "ignores": [/\.partial\.html$/, /compiled$/, /\.compiled\.html$/],
  "include": /\.html$/
});

function parseFromFile(filePath, fileStack) {
  if (fileStack === void 0) {
    fileStack = [];
  }

  if (fileStack.includes(filePath)) {
    throw new Error('Circular detected: ' + fileStack.join('->'));
  }

  try {
    var html = fs.readFileSync(filePath).toString();
    return parseHTML(html, path.dirname(filePath), fileStack.concat(filePath));
  } catch (e) {
    throw e;
  }
}

function parseHTML(html, dir, fileStack) {
  if (dir === void 0) {
    dir = process.cwd();
  }

  var ast = parse(html, {
    setAttributeMap: true
  });
  var offset = 0;

  var replaceNode = function replaceNode(node) {
    var _node$attributeMap, _node$attributeMap$sr;

    var src = (_node$attributeMap = node.attributeMap) == null ? void 0 : (_node$attributeMap$sr = _node$attributeMap.src.value) == null ? void 0 : _node$attributeMap$sr.value;
    if (!src) return;
    var realPath = path.join(dir, src);
    var replaceHTML = parseFromFile(realPath, fileStack);
    var befLength = html.length;
    html = html.substring(0, node.start + offset) + replaceHTML + html.substring(node.end + offset);
    var diff = html.length - befLength;
    offset += diff;
  };

  walk(ast, {
    enter: function enter(node) {
      if (node.type === SyntaxKind.Tag && node.name === 'include') {
        replaceNode(node);
      }
    }
  });
  return html;
}

function compileFile(file, out) {
  var outPath = out || file.replace(/\.html$/, '.compiled.html');
  var html = parseFromFile(file);
  fs.writeFileSync(outPath, html);
}

function compileFolder(folderPath) {
  var _outDir = config.outDir,
      ignores = config.ignores,
      include = config.include;
  var outDir = path.join(folderPath, _outDir);

  try {
    fs.mkdirSync(outDir);
  } catch (e) {// ignore
  }

  var files = fs.readdirSync(folderPath);
  files.forEach(function (filename) {
    if (ignores.some(function (reg) {
      return reg.test(filename);
    })) return;

    if (include.test(filename)) {
      var filepath = path.join(folderPath, filename);
      var out = path.join(outDir, filename);
      compileFile(filepath, out);
    }
  });
  return true;
}

function compileFromInput(path) {
  if (fs.statSync(path).isDirectory()) {
    return compileFolder(path);
  }

  return compileFile(path);
}

if (config._.length > 0) {
  compileFromInput(config._[0]);
}

export { compileFile, compileFolder, compileFromInput, parseFromFile, parseHTML };
//# sourceMappingURL=simple-html-template.esm.js.map
