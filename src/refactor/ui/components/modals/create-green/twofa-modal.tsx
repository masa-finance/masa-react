import React from 'react';
import { TwoFAForm } from './TwoFAForm';

export const TwoFAModal = () => {
  return (
    <section className="code-input-interface">
      <h2>Enter 2FA 6-digit code</h2>
      <div>
        <TwoFAForm />
      </div>
    </section>
  );
};
