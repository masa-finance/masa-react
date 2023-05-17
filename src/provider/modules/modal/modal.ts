import { useCallback, useEffect, useState } from 'react';

export const useModal = (
  isLoggedIn?: boolean,
  isConnected?: boolean,
  areScopesFullfiled?: boolean
): {
  isModalOpen: boolean;
  closeModal: (forceCallback?: boolean) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setModalCallback: (callback: () => void) => void;
  forcedPage: string | null;
  setForcedPage?: (page: null | string) => void;
  openMintSoulnameModal: (mintCallback?: () => void) => void;
  openMintMasaGreen: (mintCallback?: () => void) => void;
  modalSize: {
    width: number;
    height: number;
  } | null;
  setModalSize: (size: { width: number; height: number }) => void;
  useModalSize: (size: { width: number; height: number }) => void;
  openGallery: (callback?: () => void) => void;
} => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);
  const [forcedPage, setForcedPage] = useState<null | string>(null);

  const [modalSize, setModalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const closeModal = useCallback(
    (forceCallback?: boolean) => {
      setModalOpen(false);
      if (
        !forcedPage &&
        areScopesFullfiled &&
        !!modalCallback &&
        isLoggedIn &&
        isConnected
      ) {
        modalCallback();
        console.log(modalCallback.name);
      } else if (forceCallback && modalCallback) {
        modalCallback();
      }
    },
    [
      modalCallback,
      setModalOpen,
      isLoggedIn,
      isConnected,
      areScopesFullfiled,
      forcedPage,
    ]
  );

  const useModalSize = (newSize: { width: number; height: number }) => {
    useEffect(() => {
      setModalSize(newSize);
      return () => setModalSize(null);
    }, []);
  };

  const openMintSoulnameModal = useCallback(
    (mintCallback?: () => void) => {
      setForcedPage?.('createSoulname');
      setModalOpen(true);
      const cb = () => {
        setForcedPage?.(null);
        if (mintCallback) mintCallback();
      };

      setModalCallback(() => cb);
    },
    [setForcedPage, setModalOpen, setModalCallback]
  );

  const openMintMasaGreen = useCallback(
    (mintCallback?: () => void) => {
      setForcedPage?.('masaGreen');
      setModalOpen(true);
      const cb = () => {
        setForcedPage?.(null);
        if (mintCallback) mintCallback();
      };

      setModalCallback(() => cb);
    },
    [setForcedPage, setModalOpen, setModalCallback]
  );

  const openGallery = useCallback(
    (mintCallback?: () => void) => {
      setForcedPage?.('gallery');
      setModalOpen(true);
      const cb = () => {
        setForcedPage?.(null);
        if (mintCallback) mintCallback();
      };

      setModalCallback(() => cb);
    },
    [setForcedPage, setModalOpen, setModalCallback]
  );

  return {
    isModalOpen,
    closeModal,
    setModalOpen,
    setModalCallback,
    forcedPage,
    setForcedPage,
    openMintSoulnameModal,
    openMintMasaGreen,
    modalSize,
    setModalSize,
    useModalSize,
    openGallery,
  };
};
