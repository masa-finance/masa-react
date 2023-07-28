import {
  useConnectModal,
  useChainModal,
  useAccountModal,
} from '@rainbow-me/rainbowkit';
import type { Connector, Provider, Signer } from '@wagmi/core';
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

  useEffect(() => console.log({ provider, signer }), [provider, signer]);

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

  const hasAddress = useMemo(() => !!address, [address]);
  const walletName = useMemo(() => connector?.name, [connector]);

  const useWalletValue = useMemo(
    () => ({
      address,
      hasAddress,
      walletName,
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
      hasAddress,
      walletName,
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

  return useWalletValue as {
    address?: `0x${string}`;
    hasAddress: boolean;
    walletName?: string;
    previousAddress?: `0x${string}`;
    compareAddress?: `0x${string}`;
    provider?: Provider;
    signer?: Signer;
    connector?: Connector;
    isConnected?: boolean;
    isConnecting?: boolean;
    isDisconnected?: boolean;
    openConnectModal?: () => void;
    openChainModal?: () => void;
    openAccountModal?: () => void;
    disconnect?: () => void;
    disconnectAsync?: () => void;
    isLoadingSigner?: boolean;
    isLoadingBalance?: boolean;
    balance?: string;
    setPreviousAddress: React.Dispatch<
      React.SetStateAction<`0x${string}` | undefined>
    >;
    setCompareAddress: React.Dispatch<
      React.SetStateAction<`0x${string}` | undefined>
    >;
  };
};

export { useWallet };
