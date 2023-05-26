import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useMemo } from 'react';

import { useAccount, useDisconnect, useProvider, useSigner } from 'wagmi';

export interface UseWalletClientReturn {}

export const useWalletClient = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, isConnecting, isDisconnected, connector, address } =
    useAccount();
  const provider = useProvider();
  const signer = useSigner();
  const { disconnect, disconnectAsync } = useDisconnect();

  const useWalletClientReturn: UseWalletClientReturn = useMemo(
    () => ({
      address,
      provider,
      signer,
      connector,
      isConnected,
      isConnecting,
      isDisconnected,
      openConnectModal,
      disconnect,
      disconnectAsync,
    }),
    [
      address,
      provider,
      signer,
      connector,
      isConnected,
      isConnecting,
      isDisconnected,
      openConnectModal,
      disconnect,
      disconnectAsync,
    ]
  );

  return useWalletClientReturn;
};
