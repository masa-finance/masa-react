import React, { ReactNode, useCallback, useRef } from 'react';
import Rodal from 'rodal';
import { useModal } from '@ebay/nice-modal-react';

export const Modal = ({
  children,
  onClose,
  width,
  height,
}: {
  children: ReactNode;
  onClose?: () => unknown;
  width?: number;
  height?: number;
}) => {
  const modal = useModal();
  const modalRef = useRef(null);
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
      width={width || 550}
      height={height || 615}
    >
      <div ref={modalRef} className="masa-modal">
        <div className="masa-modal-container">{children}</div>
      </div>
    </Rodal>
  );
};
