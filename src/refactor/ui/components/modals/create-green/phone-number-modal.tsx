import React from 'react';
import { PhoneInputForm } from './PhoneInputForm';

export const PhoneNumberModal = () => {
  return (
    <section className="phone-input-interface">
      <div>
        <h2>Complete 2FA</h2>

        <p className="phone-input-guide">
          Please enter your phone number to qualify for rewards.
          <br />
          You have two chances to verify your phone number. Your
          <br />
          account will be locked for 24 hours after two failed
          <br />
          verification attempts.
        </p>
        <PhoneInputForm />
      </div>
    </section>
  );
};
