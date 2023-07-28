import React from 'react';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  required?: boolean;
}
export const Input = ({ label, required, className, ...rest }: InputProps) => (
  <div className="masa-input-container">
    {label && (
      <label className="masa-input-label" htmlFor={`masa-input-${label}`}>
        {label} {required && '*'}
      </label>
    )}
    <input
      className={`masa-input ${className ?? ''}`}
      {...rest}
      id={`masa-input-${label ?? ''}`}
    />
  </div>
);
