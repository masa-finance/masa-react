import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from '@rainbow-me/rainbowkit';
import { useCallback, useEffect } from 'react';
import { useConnect, useAccount, useSigner } from 'wagmi';
export const useRainbowKit = (setProvider) => {
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

  console.log({ provider: signer });

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
