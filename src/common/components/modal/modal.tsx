import Rodal from 'rodal';
import React from 'react';

import './styles.scss';

export interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
  close: () => void;
}

export const ModalComponent = ({
  children,
  open,
  close,
}: ModalProps): JSX.Element => {
  return (
    <Rodal
      height={520}
      width={500}
      visible={open}
      onClose={(): void => close()}
      className="masa-rodal-container"
    >
      <div className="masa-modal">
        <div className="masa-modal-container">{children}</div>
      </div>
    </Rodal>
  );
};
