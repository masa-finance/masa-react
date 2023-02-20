import { useQuery } from 'react-query';
import { Masa } from '@masa-finance/masa-sdk';
import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useWallet = (
  masa: Masa | null,
  provider: ethers.Wallet | ethers.Signer | null
): {
  walletAddress: string | undefined;
  status: string;
  isLoading: boolean;
  error: unknown;
  network: ethers.providers.Network | null;
} => {
  const queryKey: (string | undefined)[] = useMemo(() => {
    return ['wallet', masa?.config.network];
  }, [masa]);

  const {
    data: walletAddress,
    status,
    isLoading,
    error,
  } = useQuery(queryKey, () => masa?.config.wallet.getAddress(), {
    enabled: !!masa && !!provider,
    retry: false,
  });

  const [network, setNetwork] = useState<ethers.providers.Network | null>(null);

  const loadNetwork = useCallback(async () => {
    if (provider) {
      const newNetwork = await provider.provider?.getNetwork();
      setNetwork(newNetwork ?? null);
    }
  }, [provider]);

  useEffect(() => {
    void loadNetwork();
  }, [loadNetwork]);

  return {
    walletAddress: !provider ? undefined : walletAddress,
    status,
    isLoading,
    error,
    network,
  };
};
