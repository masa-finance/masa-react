import React, { useEffect } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../modal';

const BOT_DISCLAIMER_TIMEOUT_SECONDS = 5;

export const NotABotModal = () => {
  const modal = useModal();

  useEffect(() => {
    const timer = setTimeout(() => {
      modal.resolve();
    }, BOT_DISCLAIMER_TIMEOUT_SECONDS * 1000);

    return () => clearTimeout(timer);
  }, [modal]);

  return (
    <Modal>
      <section className="not-a-bot-interface">
        <h2>
          To be eligible for Masa Green, we kindly ask that you prove you are
          not a bot.
        </h2>
        <p className="bot-icon">🤖</p>
      </section>
    </Modal>
  );
};
