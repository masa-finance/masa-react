import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<any> {
  children?: ReactNode;
  //   onClick?: any;
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}
export const Button = ({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) => (
  <button
    type={type} // eslint-disable-line react/button-has-type
    className={`masa-button ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);
