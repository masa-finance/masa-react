import React from 'react';
import { SubflowPage } from '../../interface-subflow';

export const AirdropPage: React.FunctionComponent<SubflowPage> = ({ next }) => {
  return (
    <div>
      <h2>1,000,000 $Masa Token Airdrop</h2>
      <div>
        <p>
          Earn 10 $MASA tokens for each new user you successfully refer to Masa
        </p>
        <p>
          Each friend you refer must mint a Masa Green SBT to be considered a
          successful referral
        </p>
      </div>

      <div className="">
        <button className={'masa-button'} onClick={() => next()}>
          Get verified to start referrals
        </button>
      </div>
    </div>
  );
};
