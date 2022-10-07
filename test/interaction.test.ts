import { compileFile, compileFolder } from '../src';
import path from 'path';
import fs from 'fs';
import { Fixture } from './utils';


describe('compileFile', () => {
  it('standard include tag', () => {
    const fixture = new Fixture('./fixtures/root.html');
    compileFile(fixture.getFullPath())
    expect(fixture.getCompiledFile()).toBe(fixture.getExpectedFile())
    fs.unlinkSync(fixture.getCompiledPath());
  });
  it('nested include tag', () => {
    const fixture = new Fixture('./fixtures/root_nested.html');
    compileFile(fixture.getFullPath())
    expect(fixture.getCompiledFile()).toBe(fixture.getExpectedFile())
    fs.unlinkSync(fixture.getCompiledPath());
  })
  it('circular include', () => {
    const fixture = new Fixture('./fixtures/root_circle.html');
    expect(() => {
          compileFile(fixture.getFullPath())
    }).toThrow(/Circular detected/)
  })
});

describe('compileFolder', () => {
  it('works', () => {
    compileFolder(path.join(__dirname, './fixtures/folder'));
    const compiledFolder = path.join(__dirname, './fixtures/folder/compiled')
    const compiledIndex = fs.readFileSync(path.join(compiledFolder, './index.html')).toString();
    const expectedIndex = fs.readFileSync(path.join(compiledFolder, './index.expected.html')).toString();
    expect(compiledIndex).toBe(expectedIndex);

    const compiledPage1 = fs.readFileSync(path.join(compiledFolder, './page1.html')).toString();
    const expectedPage1 = fs.readFileSync(path.join(compiledFolder, './page1.expected.html')).toString();
    expect(compiledPage1).toBe(expectedPage1);

    fs.unlinkSync(path.join(compiledFolder, './index.html'));
    fs.unlinkSync(path.join(compiledFolder, './page1.html'));
  })
})
