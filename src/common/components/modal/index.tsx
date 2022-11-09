import { Modal } from 'antd';
import React from 'react';


import './styles.css';

export interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
  close: Function;
}

export const ModalComponent = ({ children, open, close }: ModalProps) => {
  return (
    <Modal footer={false} open={open} onCancel={() => close()}>
      <div className="masa-modal">
        {/* <img src={Logo} className="logo" alt="logo" /> */}

        <div className="masa-modal-container">{children}</div>
      </div>
    </Modal>
  );
};
