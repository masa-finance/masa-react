import React, { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Modal } from '../modal';

interface CreateGreenModalProps {
  name: string;
  Component: any;
}

export const CreateGreenModal = NiceModal.create(
  ({ step }: { step: CreateGreenModalProps }) => {
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>();

    const context = {
      phoneNumber,
      setPhoneNumber,
    };

    return (
      <Modal width={800} height={450}>
        <step.Component context={context} />
      </Modal>
    );
  }
);
