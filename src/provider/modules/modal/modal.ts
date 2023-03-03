import { useCallback, useState } from 'react';
import { Masa } from '@masa-finance/masa-sdk';
import { Network } from '../../../helpers';

export const useModal = (
  masa?: Masa,
  isLoggedIn?: boolean,
  isConnected?: boolean,
  network?: Network,
  areScopesFullfiled?: boolean
): {
  isModalOpen: boolean;
  closeModal: (forceCallback?: boolean) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setModalCallback: (callback: () => void) => void;
  forcedPage: string | null;
  setForcedPage?: (page: null | string) => void;
  openMintSoulnameModal: (mintCallback?: () => void) => void;
} => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);
  const [forcedPage, setForcedPage] = useState<null | string>(null);

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
      } else if (forceCallback && modalCallback) {
        modalCallback();
      }
    },
    [
      modalCallback,
      setModalOpen,
      isLoggedIn,
      isConnected,
      network,
      masa,
      areScopesFullfiled,
      forcedPage,
    ]
  );

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

  return {
    isModalOpen,
    closeModal,
    setModalOpen,
    setModalCallback,
    forcedPage,
    setForcedPage,
    openMintSoulnameModal,
  };
};
