import path from 'path';
import fs from 'fs';

export class Fixture {
  fullPath: string;

  constructor(relativePath: string) {
    this.fullPath = path.join(__dirname, relativePath)
  }

  getFullPath() {
    return this.fullPath;
  }

  getCompiledPath() {
return this.fullPath.replace(/\.html$/, '.compiled.html');
  }
  
  getExpectedFile() {
    const expectedPath = this.fullPath.replace(/\.html$/, '.expected.compiled.html');
    return fs.readFileSync(expectedPath).toString();
  }

  getCompiledFile() {
    return fs.readFileSync(this.getCompiledPath()).toString();
  }
}
