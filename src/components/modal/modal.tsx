import Rodal from 'rodal';
import React from 'react';

import './styles.scss';

export interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
  close: () => void;
  height?: number;
}

export const ModalComponent = ({
  children,
  open,
  close,
  height,
}: ModalProps): JSX.Element => {
  return (
    <Rodal
      data-cy="closeMasaModal"
      height={height ? height : 615}
      width={550}
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
