import React from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { MasaLoading } from '../../masa-loading';

export const VerifyMintModal = () => {
  const modal = useModal();

  return (
    <section className="verify-mint-interface">
      <h2>
        Phone number is verified!
        <br />
        Now mint your Masa Green SBT
      </h2>

      <div>
        <MasaLoading />
      </div>

      <div className="w-full flex justify-center mt-12">
        <p className="w-3/5 leading-relaxed text-lightBlack text-center">
          If you <span className="emphasize">cancel</span> your SBT mint or if
          the <span className="emphasize"> transaction fails</span> you will
          have to verify your number again.
        </p>

        <button onClick={() => modal.resolve()}>Resolve</button>
      </div>
    </section>
  );
};
