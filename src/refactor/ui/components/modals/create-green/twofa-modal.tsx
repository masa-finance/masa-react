import React, { useMemo } from 'react';
import { TwoFAForm } from './TwoFAForm';

export const TwoFAModal = ({ context }: any) => {
  const phoneNumber = useMemo(() => context.phoneNumber, [context]);
  return (
    <section className="code-input-interface">
      <div>
        <h2>Enter 2FA 6-digit code</h2>
        <h3>{`We sent a code to your phone number ending in ${phoneNumber?.slice(
          -4
        )}.`}</h3>
      </div>

      <div>
        <TwoFAForm {...context} />
      </div>
    </section>
  );
};
