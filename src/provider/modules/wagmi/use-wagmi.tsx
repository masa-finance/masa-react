import {
  Chain,
  useAccount,
  useDisconnect,
  useNetwork,
  useProvider,
  useSigner,
  useSwitchNetwork,
} from 'wagmi';
import { Signer, Wallet } from 'ethers';
import { useEffect } from 'react';

export const useWagmi = ({
  setSigner,
  logout,
}: {
  setSigner: (signer?: Signer) => void;
  logout: () => void;
}) => {
  const provider = useProvider();
  const { chain, chains } = useNetwork();
  const { isLoading: isLoadingNetwork, status } = useSwitchNetwork();

  const {
    data: signer,
    isError: isSignerError,
    isLoading: isSignerLoading,
  } = useSigner<Wallet>();

  const { isConnecting, isDisconnected, isReconnecting } = useAccount({
    onDisconnect: () => logout(),
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isReconnecting || isSignerLoading) {
      return;
    }

    setSigner(signer as Wallet);
  }, [
    setSigner,
    chain,
    signer,
    isLoadingNetwork,
    status,
    isReconnecting,
    provider,
    isSignerLoading,
  ]);

  return {
    isLoading: isSignerLoading,
    isError: isSignerError,
    isConnecting,
    isDisconnected,
    provider,
    signer,
    chain: chain as Chain,
    chains,
    disconnect,
  };
};
