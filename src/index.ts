import path from 'path';
import fs from 'fs';
import { parse, walk, SyntaxKind, INode, ITag } from 'html5parser';

type Config = {
  outDir: string,
  ignores: RegExp[],
  include: RegExp,
  _: string[],
}

const config = require('rc')('sht', {
  outDir: './compiled',
  "ignores": [/\.partial\.html$/, /compiled$/, /\.compiled\.html$/],
  "include": /\.html$/,
}) as Config;

function parseFromFile(filePath: string, fileStack: string[] = []): string {
  if (fileStack.includes(filePath)) {
    throw new Error('Circular detected: ' + fileStack.join('->'));
  }

  try {
    const html = fs.readFileSync(filePath).toString();
    return parseHTML(html, path.dirname(filePath), fileStack.concat(filePath));
  } catch (e) {
    throw e;
  }
}

function parseHTML(html: string, dir: string = process.cwd(), fileStack: string[]): string {
  const ast = parse(html, {setAttributeMap: true})
  let offset = 0;

  const replaceNode = (node: ITag) => {
    const src = node.attributeMap?.src.value?.value
    if (!src) return;
    const realPath = path.join(dir, src);

    const replaceHTML = parseFromFile(realPath, fileStack);
    const befLength = html.length;
    html = html.substring(0, node.start + offset) + replaceHTML + html.substring(node.end + offset);
    const diff = html.length - befLength;
    offset += diff;
  }

  walk(ast, {
    enter: (node: INode) => {
      if (node.type === SyntaxKind.Tag && node.name === 'include') {
        replaceNode(node)
      }
    },
  });

  return html;
}

function compileFile(file: string, out?: string) {
  const outPath = out || file.replace(/\.html$/, '.compiled.html');
  const html = parseFromFile(file);
  fs.writeFileSync(outPath, html);
}

function compileFolder(folderPath: string) {
  const { outDir: _outDir, ignores, include } = config;
  const outDir = path.join(folderPath, _outDir);
  try {
    fs.mkdirSync(outDir);
  } catch (e) {
    // ignore
  }
  const files = fs.readdirSync(folderPath);
  files.forEach(filename => {
    if (ignores.some(reg => reg.test(filename))) return;
    if (include.test(filename)) {
      const filepath = path.join(folderPath, filename);
      const out = path.join(outDir, filename);
      compileFile(filepath, out);
    }
  });
  return true;
}

function compileFromInput(path: string) {
  if(fs.statSync(path).isDirectory()) {
    return compileFolder(path)
  }

  return compileFile(path)
}

if (config._.length > 0) {
  compileFromInput(config._[0]);
}

export {
  parseFromFile,
  parseHTML,
  compileFile,
  compileFolder,
  compileFromInput,
}
