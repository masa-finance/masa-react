import { useMemo } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { Signer } from 'ethers';
// import type { Provider } from '@ethersproject/providers';
import { publicClientToProvider, walletClientToSigner } from './wagmi';

export const useEthersProvider = () => {
  const publicClient = usePublicClient();
  const provider = useMemo(() => {
    if (publicClient) return publicClientToProvider(publicClient);
    return undefined;
  }, [publicClient]);

  return provider;
};

export const useEthersSigner = () => {
  const { data: walletClient, isLoading, error } = useWalletClient();
  const signer = useMemo(() => {
    if (walletClient) return walletClientToSigner(walletClient);
    return undefined;
  }, [walletClient]);

  return { data: signer, isLoading, error } as {
    data?: Signer;
    isLoading?: boolean;
    error?: Error | null;
  };
};
