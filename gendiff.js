import _ from 'lodash';
import getFileData from './src/parsers.js';
import formatData from './formatters/index.js';

const getDataDiff = (file1Data, file2Data) => {
  const keys1 = Object.keys(file1Data);
  const keys2 = Object.keys(file2Data);
  const unionKeys = _.union(keys1, keys2);
  const sortedKeys = _.sortBy(unionKeys);
  const result = sortedKeys.reduce((acc, key) => {
    if (!Object.prototype.hasOwnProperty.call(file1Data, `${key}`)) {
      const value = { data: file2Data[key], status: 'added' };
      return { ...acc, [key]: value };
    }
    if (!Object.prototype.hasOwnProperty.call(file2Data, `${key}`)) {
      const value = { data: file1Data[key], status: 'deleted' };
      return { ...acc, [key]: value };
    }
    if (_.isObject(file1Data[key]) && _.isObject(file2Data[key])) {
      const value = { data: getDataDiff(file1Data[key], file2Data[key]), status: 'nested' };
      return { ...acc, [key]: value };
    }
    if (file1Data[key] !== file2Data[key]) {
      const value = { oldData: file1Data[key], newData: file2Data[key], status: 'changed' };
      return { ...acc, [key]: value };
    }
    const value = { data: file1Data[key], status: 'unchanged' };
    return { ...acc, [key]: value };
  }, {});
  return result;
};

const genDiff = (file1, file2, formatter = 'stylish') => {
  const file1Data = getFileData(file1);
  const file2Data = getFileData(file2);
  const data = getDataDiff(file1Data, file2Data);
  return formatData(data, formatter);
};

export default genDiff;
