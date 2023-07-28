import React from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { CreateGreenModal } from './create-green';

export const useGreenModal = () => {
  const chainingModal = useModal(CreateGreenModal);

  const showChainingModal = async () => {
    for (let i = 0; i < 3; i++) {
      console.log({ i });
      await chainingModal.show({ currentStep: i });
      await chainingModal.hide();
    }
  };
  return { showChainingModal };
};
