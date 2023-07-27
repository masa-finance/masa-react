import { SubflowPage } from 'components/masa-interface/interface-subflow';
import React from 'react';
import { useMasa } from '../../../../provider';

export const Success: React.FunctionComponent<SubflowPage> = ({
  complete,
}: SubflowPage) => {
  const { useModalSize } = useMasa();
  useModalSize?.({ width: 560, height: 420 });
  return (
    <div className="success-interface">
      <div>
        <h2>Hurray! 🎉</h2>
        <p>You are succesfully verified.</p>
        <p>
          Start inviting your friends and earning $MASA tokens. The more you
          refer, the more you earn!.
        </p>
      </div>
      <button className="masa-button" onClick={complete}>
        Start referrals
      </button>
    </div>
  );
};
