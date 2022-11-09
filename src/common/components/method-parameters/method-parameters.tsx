import React from 'react';

//@ts-ignore
import Highlighter from 'react-highlight-words';

export class MethodParameters extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
  };

  getColumnSearchProps = (dataIndex: number) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <input
          ref={(node) => {
            //@ts-ignore
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          style={{ marginBottom: 8, display: 'block' }}
        />

        <button
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 90 }}
        >
          Search
        </button>
        <button
          onClick={() => this.handleReset(clearFilters)}
          style={{ width: 90 }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            confirm({ closeDropdown: false });
            this.setState({
              searchText: selectedKeys[0],
              searchedColumn: dataIndex,
            });
          }}
        >
          Filter
        </button>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <>a</>
      // <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        //@ts-ignore
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      //@ts-ignore
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters: any) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        //@ts-ignore
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Required *',
        dataIndex: 'required',
        key: 'required',
        width: '20%',
        //@ts-ignore
        sorter: (a: any, b: any) => a.required - b.required,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Default value',
        dataIndex: 'default',
        key: 'default',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        //@ts-ignore
        ...this.getColumnSearchProps('description'),
      },
      {
        title: 'Type of the data',
        dataIndex: 'dataType',
        key: 'dataType',
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
      },
    ];

    return <>Table</>;
  }
}
