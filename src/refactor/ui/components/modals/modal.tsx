import React, { ReactNode, useCallback } from 'react';
import Rodal from 'rodal';
import { useModal } from '@ebay/nice-modal-react';

export const Modal = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => unknown;
}) => {
  const modal = useModal();
  const handleClose = useCallback(async () => {
    onClose?.();
    // await modal.hide();
    console.log('closed modal');
  }, [modal, onClose]);

  return (
    <Rodal
      className="masa-rodal-container"
      visible={modal.visible}
      onClose={handleClose}
      width={550}
      height={615}
    >
      <div className="masa-modal">
        <div className="masa-modal-container">{children}</div>
      </div>
    </Rodal>
  );
};
