import React from 'react';

interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  active: boolean;
}

export const Tab = ({ title, active, ...props }: TabProps) => (
  <button type="button" className={`tab ${active ? 'active' : ''}`} {...props}>
    {title}
  </button>
);
