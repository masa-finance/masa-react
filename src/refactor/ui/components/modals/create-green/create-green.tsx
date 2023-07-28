import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../modal';
// import type { SubflowPage } from '../../../../../components/masa-interface/interface-subflow';

export const CreateGreenModal = NiceModal.create(
  ({ currentStep }: { currentStep: number }) => {
    const steps = ['AirDrop', 'NotABot', 'PhoneNumber', 'Mint'];
    const modal = useModal();

    return (
      <Modal>
        <section>
          <h1>{steps[currentStep]}</h1>
          <br />
          <br />
          <button type="button" onClick={() => modal.resolve()}>
            Next
          </button>
        </section>
      </Modal>
    );
  }
);
