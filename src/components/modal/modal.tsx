import Rodal from 'rodal';
import React, { useEffect, useMemo, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

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

  const isMobile = useMemo(() => width < 480, [width]);

  return { isMobile, height, width };
};
export interface ModalProps {
  children: React.ReactNode;
  setOpen: (val: boolean) => void;
  height?: number;
}

export const ModalComponent = NiceModal.create(
  ({ children, height }: ModalProps): JSX.Element => {
    const {
      isMobile,
      height: screenHeight,
      width: screenWidth,
    } = useIsMobile();
    const { modalSize } = useMasa();
    const modal = useModal();

    return (
      <Rodal
        data-cy="closeMasaModal"
        height={
          isMobile ? screenHeight : modalSize ? modalSize.height : height || 615
        }
        width={isMobile ? screenWidth : modalSize ? modalSize.width : 550}
        visible={modal.visible}
        onClose={() => modal.hide()}
        className="masa-rodal-container"
      >
        <div className="masa-modal">
          <div className="masa-modal-container">{children}</div>
        </div>
      </Rodal>
    );
  }
);
