import Rodal from 'rodal';
import React, { useEffect } from 'react';

import './styles.scss';

import ScreenSizeDetector from 'screen-size-detector';

const applyMobileClass = () => {
  const listItems = document.querySelectorAll('.masa-modal');
  const mobileClass = 'in-mobile';

  listItems.forEach((el) => {
    el.classList.add(mobileClass);
  });
};

const removeMobileClass = () => {
  const listItems = document.querySelectorAll('.masa-modal');
  const mobileClass = 'in-mobile';

  listItems.forEach((el) => {
    el.classList.remove(mobileClass);
  });
};

const onDone = () => {
  console.log('Done setting callback');
};

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
  const screen = new ScreenSizeDetector();

  useEffect(() => {
    screen.setWidthCategoryCallback(
      'mobile',
      'enter',
      applyMobileClass,
      onDone
    );
    screen.setWidthCategoryCallback(
      'mobile',
      'leave',
      removeMobileClass,
      onDone
    );
  }, [screen]);
  return (
    <Rodal
      data-cy="closeMasaModal"
      height={screen.is.mobile ? screen.height : height ? height : 615}
      width={screen.is.mobile ? screen.width : 550}
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
