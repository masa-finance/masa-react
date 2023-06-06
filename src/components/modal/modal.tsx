import Rodal from 'rodal';
import React, { useEffect, useMemo, useState } from 'react';

import { useMasa } from '../../provider';

function getWindowDimensions() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    if (typeof window !== 'undefined')
      window.addEventListener('resize', handleResize);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowDimensions;
}

const useIsMobile = () => {
  const { height, width } = useWindowDimensions();

  const isMobile = useMemo(() => {
    return width < 480;
  }, [width]);

  return { isMobile, height, width };
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
  const { isMobile, height: screenHeight, width: screenWidth } = useIsMobile();
  const { modalSize } = useMasa();

  return (
    <Rodal
      data-cy="closeMasaModal"
      height={
        isMobile
          ? screenHeight
          : modalSize
          ? modalSize.height
          : height
          ? height
          : 615
      }
      width={isMobile ? screenWidth : modalSize ? modalSize.width : 550}
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
