import path from 'path';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

const parseData = (data, ext) => {
  if (ext === '.json') {
    return JSON.parse(data);
  }
  if (ext === '.yml' || ext === '.yaml') {
    return yaml.load(data);
  }
  throw new Error('Unsupported file extension');
};

const getFileData = (filepath) => {
  const fileData = readFileSync(path.resolve(filepath), 'utf8');
  const extension = path.extname(filepath);
  return parseData(fileData, extension);
};

export default getFileData;
