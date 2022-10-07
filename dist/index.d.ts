declare function parseFromFile(filePath: string, fileStack?: string[]): string;
declare function parseHTML(html: string, dir: string | undefined, fileStack: string[]): string;
declare function compileFile(file: string, out?: string): void;
declare function compileFolder(folderPath: string): boolean;
declare function compileFromInput(path: string): boolean | void;
export { parseFromFile, parseHTML, compileFile, compileFolder, compileFromInput, };
