const { parseHTML, parseFile } = require('../lib/parse');
const assert = require('assert');
const path = require('path');

describe('Simple HTML Template Testing', function() {
  describe('parseHTML', function() {
    it('include simple test', function() {
      const included = '<div>Test</div>'
      const html = parseHTML('<include src="./assets/be-included.html" />', undefined, [], () => included);
      const expected = '<div>Test</div>';
      assert.equal(html, expected);
    });
    it('include simple test with padding', function() {
      const included = '<div>Test</div>'
      const html = parseHTML(`<div>
        Test
        <include src="./assets/be-included.html" />
      </div>`, undefined, [], () => included);
      const expected = `<div>
        Test
        <div>Test</div>
      </div>`;
      assert.equal(html, expected);
    });
    it('broken tag test', function() {
      const included = '<div>Test</div>'
      const html = parseHTML('<include src="./assets/be-included.html">', undefined, [], () => included);
      const expected = '<include src="./assets/be-included.html">';
      assert.equal(html, expected);
    });
    it('missing attribute test', function() {
      const included = '<div>Test</div>'
      const html = parseHTML('<include />', undefined, [], () => included);
      const expected = '<span>Missing src attribute at require tag</span>';
      assert.equal(html, expected);
    });
  });
  describe('parseFile', function() {
    it('include simple test - read from file', function() {
      const html = parseHTML('<include src="./assets/be-included.html" />', __dirname, []);
      const expected = '<div>Test</div>';
      assert.equal(html, expected);
    });
    it('file do not exist', function() {
      const html = parseHTML('<include src="./assets/do-not-exist.html" />', undefined, []);
      assert.ok(
        /Error while reading file: ENOENT.*do-not-exist\.html/.test(html),
        'Output contains error message about non-existed file'
      );
    });
    it('parseFile simple test', function() {
      const html = parseFile(path.join(__dirname, './assets/root.html'));
      const expected = '<div>Test</div>';
      assert.equal(html, expected);
    });
    it('prevent circular deps', function() {
      const html = parseFile(path.join(__dirname, './assets/root_circular.html'));
      assert.ok(
        /Circular detected:.*root_circular\.html > .*root_circular\.html/.test(html),
        'Output contains error message about circular path'
      );
    });
    it('prevent circular deps 2', function() {
      const html = parseFile(path.join(__dirname, './assets/root_circular2.html'));
      assert.ok(
        /Circular detected:.*root_circular2\.html > .*be-included-circular\.html > .*root_circular2\.html/.test(html),
        'Output contains error message about circular path'
      );
    });
  });
});