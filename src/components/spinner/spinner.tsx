import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

export interface SpinnerProps {
  /** Spinner color */
  color?: string;
  size?: number | string;
}

export const Spinner = ({
  color = '#000',
  ...rest
}: SpinnerProps): JSX.Element => {
  return (
    <div className="masa-spinner">
      <MoonLoader color={color} {...rest} />
    </div>
  );
};
