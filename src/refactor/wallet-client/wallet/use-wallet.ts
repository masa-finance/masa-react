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
  useWalletClient as useWalletClientWagmi,
  usePublicClient,
  PublicClient,
  WalletClient,
  Connector,
} from 'wagmi';
import { Signer } from 'ethers';

import { Provider } from '@wagmi/core';
import { useEthersProvider, useEthersSigner } from '../../helpers/ethers';

export interface UseWalletReturn {
  address?: `0x${string}`;
  hasAddress: boolean;
  walletName?: string;
  previousAddress?: `0x${string}`;
  compareAddress?: `0x${string}`;
  shortAddress?: `0x${string}`;
  publicClient?: PublicClient;
  walletClient?: WalletClient;
  signer?: Signer;
  provider?: Provider;
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
}

const useWallet = (): UseWalletReturn => {
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
  const { data: walletClient, isLoading: isLoadingWalletClient } =
    useWalletClientWagmi();

  const { data: signer, isLoading: isLoadingSigner } = useEthersSigner();

  const publicClient = usePublicClient();
  const provider = useEthersProvider();

  const { disconnect, disconnectAsync } = useDisconnect();
  const {
    data: balanceResult,
    // isError: isErrorBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    address,
  });

  const shortAddress = useMemo(() => {
    if (!address) return '';

    // eslint-disable-next-line unicorn/prefer-string-slice
    return `${address?.slice(0, 2) ?? ''}...${address.substring(
      address.length - 4,
      address.length
    )}`;
  }, [address]);

  // useEffect(() => console.log({ provider, signer }), [provider, signer]);

  useEffect(() => {
    if (isDisconnected) {
      setPreviousAddress(undefined); // skipcq: JS-W1042
      setCompareAddress(undefined); // skipcq: JS-W1042
      setPreviousAddress(undefined); // skipcq: JS-W1042
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('walletconnect');
      }
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
      shortAddress,
      hasAddress,
      walletName,
      previousAddress,
      compareAddress,
      publicClient,
      walletClient,
      signer,
      isLoadingSigner,
      provider,
      connector,
      isConnected,
      isConnecting,
      isDisconnected,
      openConnectModal,
      openChainModal,
      openAccountModal,
      disconnect,
      disconnectAsync,
      isLoadingWalletClient,
      isLoadingBalance,
      balance,
      setPreviousAddress,
      setCompareAddress,
    }),
    [
      address,
      shortAddress,
      hasAddress,
      walletName,
      previousAddress,
      compareAddress,
      publicClient,
      walletClient,
      signer,
      isLoadingSigner,
      provider,
      connector,
      isConnected,
      isConnecting,
      isDisconnected,
      openConnectModal,
      openChainModal,
      openAccountModal,
      disconnect,
      disconnectAsync,
      isLoadingWalletClient,
      isLoadingBalance,
      balance,
      setPreviousAddress,
      setCompareAddress,
    ]
  );

  return useWalletValue as UseWalletReturn;
};

export { useWallet };
