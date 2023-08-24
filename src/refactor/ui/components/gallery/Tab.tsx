import React from 'react';

export const Tab = ({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={`tab ${active ? 'active' : ''}`}
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === 'Enter') {
        onClick();
      }
    }}
    key={`tab-${title}`}
  >
    {title}
  </button>
);
