import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../modal';

export const CreateGreenModal = NiceModal.create(({ currentStep }) => {
  const steps = ['AirDrop', 'NotABot', 'PhoneNumber', 'Mint'];
  const modal = useModal();

  return (
    <Modal>
      <section>
        <h1>{steps[currentStep]}</h1>
        <br />
        <br />
        <button onClick={() => modal.resolve()}>Next</button>
      </section>
    </Modal>
  );
});
