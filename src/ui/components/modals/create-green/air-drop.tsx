import React from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../modal';

export const AirDropModal = () => {
  const modal = useModal();
  return (
    <Modal>
      <section className="airdrop-interface">
        <h2>100,000 $Masa Token Airdrop</h2>
        <div>
          <p>
            Earn 10 $MASA tokens for each new user you successfully refer to
            Masa
          </p>
          <p>
            Each friend you refer must mint a Masa Green SBT to be considered a
            successful referral
          </p>
        </div>

        <div className="">
          <button
            type="button"
            className="masa-button"
            onClick={() => modal.resolve()}
          >
            Get verified to start referrals
          </button>
        </div>
      </section>
    </Modal>
  );
};
