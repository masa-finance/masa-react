import {
  useConnectModal,
  useChainModal,
  useAccountModal,
} from '@rainbow-me/rainbowkit';
import { useMemo } from 'react';

import {
  useAccount,
  useBalance,
  useDisconnect,
  useProvider,
  useSigner,
} from 'wagmi';

const useWallet = () => {
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, isConnecting, isDisconnected, connector, address } =
    useAccount();
  const provider = useProvider();
  const { data: signer, isLoading: isLoadingSigner } = useSigner();
  const { disconnect, disconnectAsync } = useDisconnect();
  const {
    data: balanceResult,
    // isError: isErrorBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    address,
  });

  const balance = useMemo(
    () =>
      `${balanceResult?.formatted as string} ${
        balanceResult?.symbol as string
      }`,
    [balanceResult]
  );

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
      isLoadingBalance,
      balance,
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
      isLoadingBalance,
      balance,
    ]
  );

  return useWalletValue;
};

export { useWallet };
