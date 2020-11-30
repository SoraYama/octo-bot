import path from 'path';

export const parseFileName = (filePath: string) => {
  const { name: fileName } = path.parse(filePath);
  const [name, type, ...suffix] = fileName.split('.');

  return {
    name,
    type,
    suffix,
  };
};
