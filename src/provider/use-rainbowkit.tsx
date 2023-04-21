import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from '@rainbow-me/rainbowkit';
import { useCallback } from 'react';

export const useRainbowKit = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  console.log(
    { openConnectModal, openAccountModal, openChainModal },
    'ALALALAL OJG'
  );

  const connectRainbowKit = useCallback(() => {
    if (!openConnectModal) return undefined;
    return () => openConnectModal();
  }, [openConnectModal]);

  return {
    openConnectModal,
    openAccountModal,
    openChainModal,
    connectRainbowKit,
  };
};
