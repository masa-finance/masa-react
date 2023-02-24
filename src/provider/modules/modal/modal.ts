import { useCallback, useState } from 'react';
import { providers } from 'ethers';
import { Masa } from '@masa-finance/masa-sdk';

export const useModal = (
  masa?: Masa,
  isLoggedIn?: boolean,
  isConnected?: boolean,
  network?: providers.Network
): {
  isModalOpen: boolean;
  closeModal: () => void;
  setModalOpen: (modalOpen: boolean) => void;
  setModalCallback: (callback: () => void) => void;
} => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (
      modalCallback &&
      isLoggedIn &&
      isConnected &&
      (masa?.config.network
        ? !network?.name.includes(masa.config.network)
        : true)
    ) {
      modalCallback();
    }
  }, [modalCallback, setModalOpen, isLoggedIn, isConnected, network, masa]);

  return {
    isModalOpen,
    closeModal,
    setModalOpen,
    setModalCallback,
  };
};
