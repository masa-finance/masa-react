import React from 'react';
import { Table, Input } from 'antd';
import 'react-highlight-words';

export const CustomParameters = ({ data, onValueChange }) => {
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
  return (
    <Table
      columns={columns}
      dataSource={Object.keys(data).map(key => ({
        key,
        value: (
          <Input
            value={data[key]}
            onChange={e => onValueChange(key, e.target.value)}
          />
        ),
      }))}
    />
  );
};
