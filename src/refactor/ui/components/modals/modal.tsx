import React from 'react';
import Rodal from 'rodal';
import { useModal } from '@ebay/nice-modal-react';

export const Modal = ({ children }) => {
  const modal = useModal();
  return (
    <Rodal
      className="masa-rodal-container"
      visible={modal.visible}
      onClose={() => modal.hide()}
      width={550}
      height={615}
    >
      <div className="masa-modal">
        <div className="masa-modal-container">{children}</div>
      </div>
    </Rodal>
  );
};
