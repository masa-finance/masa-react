import { SubflowPage } from 'components/masa-interface/interface-subflow';
import React from 'react';
export const Error: React.FunctionComponent<SubflowPage> = ({ setIndex }) => {
  const handleReturn = () => {
    setIndex(0);
  };

  return (
    <div>
      Error
      <button className="masa=button" onClick={handleReturn}>
        Return
      </button>
    </div>
  );
};
