import React from 'react';

const Toggle = ({ handleToggle, isChecked }) => {
  return (
    <label className={`toggle ${isChecked ? 'checked' : ''}`}>
      <input type="checkbox" checked={isChecked} onChange={handleToggle} />
      <span className="slider"></span>
    </label>
  );
};

export default Toggle;
