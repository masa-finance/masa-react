import React from 'react';
import 'react-highlight-words';

export const PathParameters = ({ data, onValueChange }) => {
  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: '50%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
    },
  ];
  console.log(data, onValueChange, columns);
  return <></>;
};
