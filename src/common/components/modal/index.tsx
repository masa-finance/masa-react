import Rodal from 'rodal';
import React from 'react';

import './styles.css';
import 'rodal/lib/rodal.css';

export interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
  close: Function;
}

export const ModalComponent = ({ children, open, close }: ModalProps) => {
  return (
    <Rodal visible={open} onClose={() => close()}>
      <div className="masa-modal">
        {/* <img src={Logo} className="logo" alt="logo" /> */}

        <div className="masa-modal-container">{children}</div>
      </div>
    </Rodal>
  );
};
