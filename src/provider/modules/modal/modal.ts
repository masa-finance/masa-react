import { useCallback, useState } from 'react';
import { providers } from 'ethers';
import { Masa } from '@masa-finance/masa-sdk';

export const useModal = (
  masa?: Masa,
  isLoggedIn?: boolean,
  isConnected?: boolean,
  network?: providers.Network,
  areScopesFullfiled?: boolean
): {
  isModalOpen: boolean;
  closeModal: (forceCallback?: boolean) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setModalCallback: (callback: () => void) => void;
  forcedPage: string | null;
  setForcedPage?: (page: null | string) => void;
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
        isConnected &&
        (masa?.config.network
          ? network?.name.includes(masa.config.network)
          : true)
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

  return {
    isModalOpen,
    closeModal,
    setModalOpen,
    setModalCallback,
    forcedPage,
    setForcedPage,
  };
};
