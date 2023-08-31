import { useMemo } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import type { Provider } from '@wagmi/core';
import { Signer } from 'ethers';
import { publicClientToProvider, walletClientToSigner } from './wagmi';

export const useEthersProvider = (): Provider | undefined => {
  const publicClient = usePublicClient();
  const provider = useMemo(() => {
    if (publicClient) publicClientToProvider(publicClient);
    return undefined;
  }, [publicClient]);

  return provider;
};

export const useEthersSigner = (): Signer | undefined => {
  const { data: walletClient } = useWalletClient();
  const signer = useMemo(() => {
    if (walletClient) walletClientToSigner(walletClient);
    return undefined;
  }, [walletClient]);

  return signer;
};
