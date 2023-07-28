import React from 'react';
import Reaptcha from 'reaptcha';
import { useModal } from '@ebay/nice-modal-react';

export const NotABotModal = () => {
  const modal = useModal();

  const onRecaptchaVerify = () => {
    modal.resolve();
  };

  return (
    <section className="not-a-bot-interface">
      <h2>
        To be eligible for Masa Green, we kindly ask that you prove you are not
        a bot.
      </h2>

      {/* <Reaptcha
          className="g-recaptcha"
          sitekey="6Lf623YkAAAAALcfUuQnr0NVdUwffckx_OQdfJs6"
          onVerify={onRecaptchaVerify}
          />
        */}
      <button onClick={() => modal.resolve()}>Resolve</button>
      <p className="bot-icon">🤖</p>
    </section>
  );
};
