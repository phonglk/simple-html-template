const { parseIndividualFile, parseFolder } = require('../lib/parse-folder');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

describe('Simple HTML File Operation', () => {
  describe('parse individual file', () => {
    parseIndividualFile(path.join(__dirname, './assets/root.html'));
    let output;
    let error;
    const compiledPath = path.join(__dirname, './assets/root.compiled.html');
    try {
      output = fs.readFileSync(compiledPath);
    } catch (e) {
      error = e;
    }
    it('file existence', function() {
      assert.equal(error, null);
    });
    it('file compiled ok', function() {
      const expected = '<div>Test</div>';
      assert.equal(output, expected);
    });
    // clean up
    fs.unlinkSync(compiledPath);
  });
  describe('parse folder', () => {
    let cfiles;
    let error;
    let compiledPath;
    before(() => {
      parseFolder(path.join(__dirname, './assets/folder'));
      compiledPath = path.join(__dirname, './assets/folder/compiled');
      try {
        cfiles = fs.readdirSync(compiledPath);
      } catch (e) {
        error = e;
      }
    });
    after(() => {
      cfiles.forEach(f => fs.unlinkSync(path.join(compiledPath, f)));
      fs.rmdirSync(compiledPath);
    });
    it('folder access ok', () => {
      assert.equal(error, null);
    });
    it('list of compiled file', () => {
      const filesShouldHave = ['root.html', 'be-included.html'];
      assert.equal(true, cfiles.every(f => filesShouldHave.indexOf(f) > -1));
    });
    it('root.html', () => {
      assert.equal(
        fs.readFileSync(path.join(compiledPath, 'root.html')).toString(),
        '<div>Test</div>'
      );
    });
  });
  describe('parse folder with configuration', () => {
    let cfiles;
    let error;
    let compiledPath;
    before(() => {
      fs.writeFileSync(path.join(__dirname, './assets/folder', 'sht.config.json'),
        JSON.stringify({
          outDir: '../compiled',
        }));
      parseFolder(path.join(__dirname, './assets/folder'));
      compiledPath = path.join(__dirname, './assets/compiled');
      try {
        cfiles = fs.readdirSync(compiledPath);
      } catch (e) {
        error = e;
      }
    });
    after(() => {
      fs.unlinkSync(path.join(__dirname, './assets/folder', 'sht.config.json'));
      cfiles.forEach(f => fs.unlinkSync(path.join(compiledPath, f)));
      fs.rmdirSync(compiledPath);
    });
    it('folder access ok', () => {
      assert.equal(error, null);
    });
    it('list of compiled file', () => {
      const filesShouldHave = ['root.html', 'be-included.html'];
      assert.equal(true, cfiles.every(f => filesShouldHave.indexOf(f) > -1));
    });
    it('root.html', () => {
      assert.equal(
        fs.readFileSync(path.join(compiledPath, 'root.html')).toString(),
        '<div>Test</div>'
      );
    });
  });
});
