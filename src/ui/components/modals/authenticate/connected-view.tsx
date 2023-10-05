import React, { useEffect } from 'react';
import type { NiceModalHandler } from '@ebay/nice-modal-react';
import { Spinner } from '../../spinner';
import { Modal } from '../modal';

interface ConnectedViewProps {
  titleText: string;
  modal: NiceModalHandler<Record<string, unknown>>;
  loading: boolean;
  closeTimeoutMS?: number;
  onClose?: () => void;
}

const ConnectedView = ({
  titleText,
  modal,
  loading,
  closeTimeoutMS = 3000,
  onClose,
}: ConnectedViewProps) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (modal.visible && !loading) {
      timeout = setTimeout(() => {
        modal.remove();
        onClose?.();
      }, closeTimeoutMS);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [loading, modal, closeTimeoutMS, onClose]);

  return (
    <Modal>
      <section className="interface-connected">
        <section className="loading">
          <h3 className="title">{titleText}</h3>
          <Spinner />
        </section>
      </section>
    </Modal>
  );
};

export default ConnectedView;
