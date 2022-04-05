import _ from 'lodash';

const formatOutput = (value) => {
  const valueType = typeof value;
  return valueType === 'string' ? `'${value}'` : value;
};

const formatToPlain = (value) => {
  const iter = (currentValue, path) => {
    const result = Object
      .entries(currentValue)
      .flatMap(([key, val]) => {
        if (val.status === 'added') {
          const data = _.isObject(val.data) ? '[complex value]' : formatOutput(val.data);
          return `Property '${[...path, key].join('.')}' was added with value: ${data}`;
        }
        if (val.status === 'deleted') {
          return `Property '${[...path, key].join('.')}' was removed`;
        }
        if (val.status === 'changed') {
          const oldData = _.isObject(val.oldData) ? '[complex value]' : formatOutput(val.oldData);
          const newData = _.isObject(val.newData) ? '[complex value]' : formatOutput(val.newData);
          return `Property '${[...path, key].join('.')}' was updated. From ${oldData} to ${newData}`;
        }
        if (val.status === 'unchanged') {
          return [];
        }
        return iter(val.data, [...path, key]);
      });
    return result.join('\n');
  };
  return iter(value, []);
};
export default formatToPlain;
