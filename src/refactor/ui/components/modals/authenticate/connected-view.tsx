import React, { useEffect } from 'react';
import type { NiceModalHandler } from '@ebay/nice-modal-react';
import { Spinner } from '../../spinner';
import { Modal } from '../modal';

interface ConnectedViewProps {
  titleText: string;
  modal: NiceModalHandler<Record<string, unknown>>;
  isLoadingSession: boolean;
}

const ConnectedView = ({
  titleText,
  modal,
  isLoadingSession,
}: ConnectedViewProps): JSX.Element => {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // TODO: This wont be needed anymore
    if (modal.visible && !isLoadingSession) {
      timeout = setTimeout(() => {
        modal.hide().catch(() => {});
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoadingSession, modal]);

  return (
    <Modal>
      <section className="interface-connected">
        <section>
          <h3 className="title">{titleText}</h3>
          <Spinner />
        </section>
      </section>
    </Modal>
  );
};

export default ConnectedView;
