import { useModal } from '@ebay/nice-modal-react';
import { CreateGreenModal } from './create-green';

export const useGreenModal = () => {
  const chainingModal = useModal(CreateGreenModal);
  const showChainingModal = async () => {
    for (let i = 0; i < 3; i += 1) {
      console.log({ i });
      await chainingModal.show({ currentStep: i }); // eslint-disable-line no-await-in-loop
      await chainingModal.hide(); // eslint-disable-line no-await-in-loop
    }
  };
  return { showChainingModal };
};
