import { useQuery } from 'react-query';
import { Masa, NetworkName } from '@masa-finance/masa-sdk';
import { Signer, Wallet } from 'ethers';
import { useMemo } from 'react';

export const useWallet = (
  masa?: Masa,
  provider?: Wallet | Signer
): {
  walletAddress?: string;
  isWalletLoading: boolean;
  hasWalletAddress: boolean;
  status: string;
  error: unknown;
} => {
  const queryKey: (string | NetworkName | undefined)[] = useMemo(() => {
    return ['wallet', masa?.config.networkName];
  }, [masa]);

  const {
    data: walletAddress,
    status,
    isLoading,
    isFetching,
    error,
  } = useQuery<string | undefined>(
    queryKey,
    () => masa?.config.wallet.getAddress(),
    {
      enabled: !!masa && !!provider,
      retry: false,
    }
  );

  const hasWalletAddress = useMemo(() => {
    return !!walletAddress;
  }, [walletAddress]);

  return {
    walletAddress: !provider ? undefined : walletAddress,
    isWalletLoading: isLoading || isFetching,
    hasWalletAddress,
    status,
    error,
  };
};
