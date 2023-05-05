import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import { useCallback, useEffect, useState } from 'react';

export const useRainbowKit = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  // NOTE: needs refactor ASAP
  const [modalCallback, setRainbowKitModalCallback] =
    useState<(modalOpen?: boolean) => void>();

  // NOTE: needs refactor ASAP, quick fix to set global provider
  // useEffect(() => {
  //   if (signer) {
  //     setProvider(signer);
  //   }
  // }, [signer, setProvider]);

  const openRainbowkitConnectModal = useCallback(() => {
    if (!openConnectModal) return undefined;
    return () => openConnectModal();
  }, [openConnectModal]);

  // * quick fix for making sure we open the second modal of useMasa after wallet connect is closed
  useEffect(() => {
    if (modalCallback && openAccountModal && openChainModal) {
      // we open the original modal of useMasa now
      modalCallback();
      setRainbowKitModalCallback(undefined);
    }
  }, [modalCallback, openAccountModal, openChainModal, openConnectModal]);

  return {
    openConnectModal,
    openAccountModal,
    openChainModal,
    openRainbowkitConnectModal,
    setRainbowKitModalCallback,
  };
};
