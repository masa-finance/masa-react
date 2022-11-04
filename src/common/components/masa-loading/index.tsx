import React from 'react';
import { Spin } from 'antd';

export const MasaLoading = () => {
  return (
    <div className="spinner">
      <Spin tip="Loading..."></Spin>
    </div>
  );
};
