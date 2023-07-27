import React from 'react';

const Toggle = ({
  handleToggle,
  isChecked,
}: {
  handleToggle: (event) => void;
  isChecked: boolean;
}) => (
  <div className={`toggle ${isChecked ? 'checked' : ''}`}>
    <input type="checkbox" checked={isChecked} onChange={handleToggle} />
    <span className="slider" />
  </div>
);

export default Toggle;
