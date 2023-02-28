import React from 'react';
interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  required?: boolean;
}
export const Input = ({ label, required, ...rest }: InputProps) => {
  return (
    <div className="masa-input-container">
      {label && (
        <label className="masa-input-label">
          {label} {required && '*'}
        </label>
      )}
      <input className="masa-input" {...rest} />
    </div>
  );
};
