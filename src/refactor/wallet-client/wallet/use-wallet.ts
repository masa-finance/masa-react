import {
  useConnectModal,
  useChainModal,
  useAccountModal,
} from '@rainbow-me/rainbowkit';
import { useEffect, useMemo, useState } from 'react';

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
  const [previousAddress, setPreviousAddress] = useState<
    `0x${string}` | undefined
  >();
  // * NOTE: internal state to compare addresses
  const [compareAddress, setCompareAddress] = useState(address);
  const { data: signer, isLoading: isLoadingSigner } = useSigner();
  const { disconnect, disconnectAsync } = useDisconnect();
  const provider = useProvider();
  const {
    data: balanceResult,
    // isError: isErrorBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    address,
  });

  useEffect(() => {
    if (isDisconnected) {
      setPreviousAddress(undefined); // skipcq: JS-W1042
      setCompareAddress(undefined); // skipcq: JS-W1042
      setPreviousAddress(undefined); // skipcq: JS-W1042
    }

    if (compareAddress !== address) {
      setPreviousAddress(compareAddress);
      setCompareAddress(address);
    }
  }, [
    address,
    setPreviousAddress,
    isDisconnected,
    previousAddress,
    compareAddress,
    setCompareAddress,
  ]);
  const balance = useMemo(() => {
    if (!balanceResult) return '';
    return `${balanceResult?.formatted} ${balanceResult?.symbol}`;
  }, [balanceResult]);

  const useWalletValue = useMemo(
    () => ({
      address,
      previousAddress,
      compareAddress,
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
      setPreviousAddress,
      setCompareAddress,
    }),
    [
      address,
      previousAddress,
      compareAddress,
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
      setPreviousAddress,
      setCompareAddress,
    ]
  );

  return useWalletValue;
};

export { useWallet };
