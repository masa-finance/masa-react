import { useCallback, useState } from 'react';
import { NetworkName } from '@masa-finance/masa-sdk';
import { providers } from 'ethers';

export const useModal = (
  networkName?: NetworkName,
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
      (networkName ? !network?.name.includes(networkName) : true)
    ) {
      modalCallback();
    }
  }, [
    modalCallback,
    setModalOpen,
    isLoggedIn,
    isConnected,
    network,
    networkName,
  ]);

  return {
    isModalOpen,
    closeModal,
    setModalOpen,
    setModalCallback,
  };
};
