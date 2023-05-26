import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useMemo } from 'react';

import { useAccount, useDisconnect, useProvider, useSigner } from 'wagmi';


export const useWalletClient = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, isConnecting, isDisconnected, connector, address } =
    useAccount();
  const provider = useProvider();
  const { data: signer, isLoading: isLoadingSigner } = useSigner();
  const { disconnect, disconnectAsync } = useDisconnect();

  const useWalletClientReturn = useMemo(
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
      isLoadingSigner,
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
      isLoadingSigner,
    ]
  );

  return useWalletClientReturn;
};

