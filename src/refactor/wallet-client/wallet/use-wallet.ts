import {
  useConnectModal,
  useChainModal,
  useAccountModal,
} from '@rainbow-me/rainbowkit';
import { useMemo } from 'react';

import { useAccount, useDisconnect, useProvider, useSigner } from 'wagmi';

const useWallet = () => {
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, isConnecting, isDisconnected, connector, address } =
    useAccount();
  const provider = useProvider();
  const { data: signer, isLoading: isLoadingSigner } = useSigner();
  const { disconnect, disconnectAsync } = useDisconnect();

  const useWalletValue = useMemo(
    () => ({
      address,
      provider,
      signer,
      connector,
      isConnected,
      isConnecting,
      isDisconnected,
      openConnectModal,
      openChainModal,
      openAccountModal,
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
      openChainModal,
      openAccountModal,
      disconnect,
      disconnectAsync,
      isLoadingSigner,
    ]
  );

  return useWalletValue;
};

export { useWallet };
