import React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Modal } from '../modal';

interface CreateGreenModalProps {
  name: string;
  component: any;
}

export const CreateGreenModal = NiceModal.create(
  ({ step }: { step: CreateGreenModalProps }) => {
    return <Modal>{step.component()}</Modal>;
  }
);
