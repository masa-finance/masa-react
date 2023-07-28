import { useModal } from '@ebay/nice-modal-react';
import { CreateGreenModal } from './create-green';

import { AirDropModal } from './air-drop';
import { NotABotModal } from './not-a-bot-modal';
import { PhoneNumberModal } from './phone-number-modal';
import { TwoFAModal } from './twofa-modal';
import { VerifyMintModal } from './verify-and-mint';
import { SuccessModal } from './success-modal';

export const useGreenModal = () => {
  const chainingModal = useModal(CreateGreenModal);

  const showChainingModal = async () => {
    const steps = [
      AirDropModal,
      NotABotModal,
      PhoneNumberModal,
      TwoFAModal,
      VerifyMintModal,
      SuccessModal,
    ];

    for (const step of steps) {
      await chainingModal.show({ children: step });
    }
    await chainingModal.hide();
  };

  return { showChainingModal };
};
