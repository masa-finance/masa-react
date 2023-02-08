import { useQuery } from 'react-query';
import { Masa } from '@masa-finance/masa-sdk';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

export const useWallet = (
  masa: Masa | null,
  provider: ethers.Wallet | ethers.Signer | null
): {
  walletAddress: string | undefined;
  status: string;
  isLoading: boolean;
  error: unknown;
  chain?: null | ethers.providers.Network;
} => {
  const {
    data: walletAddress,
    status,
    isLoading,
    error,
  } = useQuery(`wallet`, () => masa?.config.wallet.getAddress(), {
    enabled: !!masa && !!provider,
  });

  const [chain, setChain] = useState<
    null | undefined | ethers.providers.Network
  >(null);

  const loadChainId = useCallback(async () => {
    if (provider) {
      const network = await provider.provider?.getNetwork();
      setChain(network);
    }
  }, [provider]);

  useEffect(() => {
    loadChainId();
  }, [loadChainId, setChain]);

  return {
    walletAddress: !provider ? undefined : walletAddress,
    status,
    isLoading,
    error,
    chain,
  };
};
