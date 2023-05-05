import { useQuery } from 'react-query';
import { Masa, NetworkName } from '@masa-finance/masa-sdk';
import { Signer, Wallet } from 'ethers';
import { useEffect, useMemo } from 'react';

export const useWallet = (
  masa?: Masa,
  signer?: Wallet | Signer
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
    refetch,
  } = useQuery<string | undefined>(
    queryKey,
    () => masa?.config.wallet.getAddress(),
    {
      enabled: !!masa && !!signer,
      retry: false,
      onSuccess: (address: string | undefined) => {
        if (masa?.config.verbose) {
          console.log('wallet address', address);
        }
      },
    }
  );

  useEffect(() => {
    void refetch();
  }, [refetch, signer]);

  const hasWalletAddress = useMemo(() => {
    return !!walletAddress;
  }, [walletAddress]);

  return {
    walletAddress: !signer ? undefined : walletAddress,
    isWalletLoading: isLoading || isFetching,
    hasWalletAddress,
    status,
    error,
  };
};
