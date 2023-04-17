import { SubflowPage } from 'components/masa-interface/interface-subflow';
import { useMasa } from '../../../../provider';
import React from 'react';
export const Error: React.FunctionComponent<SubflowPage> = ({
  next,
}: SubflowPage) => {
  const { useModalSize } = useMasa();
  useModalSize?.({ width: 560, height: 380 });
  return (
    <div className="success-interface">
      <div>
        <h2>Whoops!</h2>
        <p>Something whent wrong.</p>
      </div>
      <button className="masa-button" onClick={next}>
        Try again
      </button>
    </div>
  );
};