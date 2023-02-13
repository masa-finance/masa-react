import React from 'react';
import { Spinner } from '../spinner';

export const MasaLoading = (): JSX.Element => {
  return (
    <div className="spinner">
      <Spinner />
    </div>
  );
};
