import React from 'react';

interface InputProps extends React.HTMLProps<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  values?: { name: string; value: string }[];
}

export const Select = ({
  label,
  required,
  values,
  className,
  ...rest
}: InputProps) => (
  <div className="masa-input-container">
    {label && (
      <label className="masa-input-label" htmlFor={`masa-input-${label}`}>
        {label} {required && '*'}
      </label>
    )}
    <select
      className={`masa-input ${className ?? ''}`}
      {...rest}
      id={`masa-input-${label ?? ''}`}
    >
      {values?.map((v: { name: string }) => (
        <option key={v.name ?? Math.random().toString()} value={v.name}>
          {v.name}
        </option>
      ))}
    </select>
  </div>
);
