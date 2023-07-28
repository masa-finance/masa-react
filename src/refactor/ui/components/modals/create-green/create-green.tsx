import React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Modal } from '../modal';

export const CreateGreenModal = NiceModal.create(
  ({ children }: { children: JSX.Element }) => {
    return <Modal>{children()}</Modal>;
  }
);
