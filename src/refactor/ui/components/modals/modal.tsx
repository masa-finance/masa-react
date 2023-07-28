import React, { ReactNode, useCallback, useRef } from 'react';
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
  const modalRef = useRef(null);
  const handleClose = useCallback(async () => {
    onClose?.();
    await modal.hide();
  }, [modal, onClose]);

  return (
    <Rodal
      closeOnEsc
      className="masa-rodal-container"
      visible={modal.visible}
      onClose={handleClose}
      width={550}
      height={615}
    >
      <div ref={modalRef} className="masa-modal">
        <div className="masa-modal-container">{children}</div>
      </div>
    </Rodal>
  );
};
