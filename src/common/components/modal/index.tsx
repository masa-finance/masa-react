import { Modal } from 'antd';
import React from 'react';
import Logo from './logo.svg';

import './styles.css';

export interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
}

export const ModalComponent = ({ children, open, setOpen }: ModalProps) => {
  return (
    <Modal footer={false} open={open} onCancel={() => setOpen(false)}>
      <div className="masa-modal">
        <img src={Logo} className="logo" alt="logo" />

        <div className="masa-modal-container">{children}</div>
      </div>
    </Modal>
  );
};
