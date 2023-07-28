import React from 'react';
import { useModal } from '@ebay/nice-modal-react';

export const SuccessModal = () => {
  const modal = useModal();

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
      <button className="masa-button" onClick={() => modal.resolve()}>
        Start referrals
      </button>
    </div>
  );
};
