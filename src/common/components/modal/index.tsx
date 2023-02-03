import Rodal from 'rodal';
import React from 'react';

import './styles.scss';

export interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
  close: Function;
}

export const ModalComponent = ({ children, open, close }: ModalProps) => {
  return (
    <Rodal
      height={520}
      width={500}
      visible={open}
      onClose={() => close()}
      className="masa-rodal-container"
    >
      <div className="masa-modal">
        <div className="masa-modal-container">{children}</div>
      </div>
    </Rodal>
  );
};
