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
      { name: 'AirDrop', component: AirDropModal },
      { name: 'NotABotModal', component: NotABotModal },
      { name: 'PhoneNumberModal', component: PhoneNumberModal },
      { name: 'TwoFAModal', component: TwoFAModal },
      { name: 'VerifyMint', component: VerifyMintModal },
      { name: 'SuccessModal', component: SuccessModal },
    ];

    for (const step of steps) {
      await chainingModal.show({ step });
    }
    await chainingModal.hide();
  };

  return { showChainingModal };
};
