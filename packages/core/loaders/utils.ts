import path from 'path';
import fs from 'fs';

export function parseFileName(filePath: string) {
  const { name: fileName } = path.parse(filePath);
  const [name, type, ...suffix] = fileName.split('.');

  return {
    name,
    type,
    suffix,
  };
}

export async function loadDir(
  dirPath: string,
  loadFn: (filePath: string) => Promise<void>,
  ignoreDirs: string[] = [],
) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(async (file) => {
    const filePath = path.resolve(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (ignoreDirs.indexOf(file) === -1) {
        await loadDir(filePath, loadFn);
      }
    } else {
      await loadFn(filePath);
    }
  });
}
