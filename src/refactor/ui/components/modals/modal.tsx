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
    await modal.hide();
  }, [modal, onClose]);

  return (
    <Rodal
      className="masa-rodal-container"
      visible={modal.visible}
      onClose={handleClose}
      closeOnEsc
      width={550}
      height={615}
      customStyles={{ maxWidth: '100%' }}
    >
      <div className="masa-modal">
        <div className="masa-modal-container">{children}</div>
      </div>
    </Rodal>
  );
};
