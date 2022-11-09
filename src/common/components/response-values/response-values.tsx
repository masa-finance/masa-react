import React, { useState } from 'react';
//@ts-ignore
import Highlighter from 'react-highlight-words';

export const ResponseValues = ({ data }: { data: JSON }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          style={{ marginBottom: 8, display: 'block' }}
        />

        <button
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 90 }}
        >
          Search
        </button>
        <button onClick={() => handleReset(clearFilters)} style={{ width: 90 }}>
          Reset
        </button>
        <button
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}
        >
          Filter
        </button>
      </div>
    ),
    filterIcon: (filtered: any) => <>a</>,
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text: any) =>
      //@ts-ignore
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: '50%',
      ...getColumnSearchProps('key'),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
      ...getColumnSearchProps('value'),
    },
  ];
  return <>table</>;
};
