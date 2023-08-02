import React from 'react';
import { TwoFAForm } from './TwoFAForm';
import { useCreateGreenModal } from './CreateGreenProvider';

export const TwoFAModal = () => {
  const { phoneNumberContext } = useCreateGreenModal();
  return (
    <section className="code-input-interface">
      <div>
        <h2>Enter 2FA 6-digit code</h2>
        <h3>{`We sent a code to your phone number ending in ${phoneNumberContext?.slice(
          -4
        )}.`}</h3>
      </div>

      <div>
        <TwoFAForm />
      </div>
    </section>
  );
};
