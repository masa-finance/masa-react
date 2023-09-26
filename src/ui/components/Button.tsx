import React, { ReactNode, Ref } from 'react';

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  children?: ReactNode;
  //   onClick?: any;
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}
export const Button = ({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled,
  ref,
  ...rest
}: ButtonProps) => (
  <button
    ref={ref}
    type={type} // eslint-disable-line react/button-has-type
    className={`masa-button ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);
