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
}: InputProps) => {
  return (
    <div className="masa-input-container">
      {label && (
        <label className="masa-input-label">
          {label} {required && '*'}
        </label>
      )}
      <select className={`masa-input ${className}`} {...rest}>
        {values &&
          values.map((v: { name: string }) => {
            return <option value={v.name}>{v.name}</option>;
          })}
      </select>
    </div>
  );
};
