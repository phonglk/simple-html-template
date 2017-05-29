const path = require('path');
const fs = require('fs');

const templateFuncs = {
  include: (props) => {
    if (typeof props.src === 'undefined') {
      return {
        replace: true,
        html: '<span>Missing src attribute at require tag</span>',
      };
    }
    const filePath = path.join(props.dir, props.src);
    const content = parseFile(filePath, props.stack, props.__readfile);
    return {
      replace: true,
      html: content,
    };
  },
};
const templateTagRegExp = new RegExp(`[ \t]*<(${Object.keys(templateFuncs).join('|')})[^>]*\/>`, 'g');
const tagRegExp = /([ \t]*)<([\w]+) +([^>]*)\/>/;

function parseHTML(html, dir = process.env.PWD, stack = [], readfile) {
  let rplHtml = html;
  const tTagMatches = html.match(templateTagRegExp);
  if (tTagMatches !== null && tTagMatches.length) {
    tTagMatches.forEach((matchedTag) => {
      const elementMatches = matchedTag.match(tagRegExp);
      const [, spacePrefix, tag, params] = elementMatches;
      const handler = templateFuncs[tag];
      const props = {
        dir,
        stack,
        __readfile: readfile,
      };
      params.split(/ +/).forEach((param) => {
        const propMatches = param.trim().match(/(.*)="?(.*)"?/);
        if (propMatches === null) return;
        const [, key, val] = propMatches;
        props[key] = val.replace(/(^"|"$)/, '');
      });
      const output = handler(props);
      if (output.replace === true) {
        const spacedHtml = output.html.split(/\n/).map(line => spacePrefix + line).join('\n');
        rplHtml = rplHtml.replace(matchedTag, spacedHtml);
      }
    });
  }
  return rplHtml;
}

function parseFile(file, stack = [], readfile = f => fs.readFileSync(f).toString()) {
  if (stack.indexOf(file) > -1) {
    return `<span>Circular detected: ${stack.join(' > ')} > ${file}</span>`;
  }
  let html;
  try {
    html = readfile(file);
  } catch (e) {
    return `<span>Error while reading file: ${e.message}</span>`;
  }
  return parseHTML(html, path.dirname(file), stack.concat(file), readfile);
}

module.exports = {
  parseHTML,
  parseFile,
};
