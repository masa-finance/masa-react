import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

export interface SpinnerProps {
  /** Spinner color */
  color?: string;
}

export function Spinner({ color = '#000' }: SpinnerProps) {
  return (
    <div className="masa-spinner">
      <MoonLoader color={color}/>
    </div>
  );
}
