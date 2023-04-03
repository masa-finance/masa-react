import React from 'react';
import { SubflowPage } from '../../interface-subflow';

export const AirdropPage: React.FunctionComponent<SubflowPage> = ({
  next,
  back,
}) => {
  return (
    <div>
      Hello! airdrop page
      <button onClick={back}>Go back</button>
      <button onClick={next}>Go next</button>
    </div>
  );
};
