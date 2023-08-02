import React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Modal } from '../modal';
import { CreateGreenProvider } from './CreateGreenProvider';

interface CreateGreenModalProps {
  name: string;
  Component: any;
}

export const CreateGreenModal = NiceModal.create(
  ({ step }: { step: CreateGreenModalProps }) => {
    return (
      <CreateGreenProvider>
        <Modal width={800} height={450}>
          <step.Component />
        </Modal>
      </CreateGreenProvider>
    );
  }
);
