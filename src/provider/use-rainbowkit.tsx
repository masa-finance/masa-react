import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from '@rainbow-me/rainbowkit';
import React, { useCallback, useEffect } from 'react';
import { useConnect, useAccount, useSigner } from 'wagmi';
import { Signer, Wallet } from 'ethers';

export const useRainbowKit = (
  setProvider: React.Dispatch<React.SetStateAction<Signer | Wallet | undefined>>
) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  const { connectors, error, isLoading, pendingConnector } = useConnect();
  const { address, connector, isConnected } = useAccount();
  const { data: signer } = useSigner();

  console.log({
    connectors,
    error,
    isLoading,
    pendingConnector,
    address,
    connector,
    isConnected,
  });

  useEffect(() => {
    if (signer) {
      setProvider(signer);
    }
  }, [signer, setProvider]);

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
