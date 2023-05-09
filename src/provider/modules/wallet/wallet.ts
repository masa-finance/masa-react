import { useQuery } from 'react-query';
import { Masa, NetworkName } from '@masa-finance/masa-sdk';
import { Signer, Wallet } from 'ethers';
import { useEffect, useMemo } from 'react';

export const getWalletQueryKey = ({
  masa,
}: {
  masa?: Masa;
  signer?: Signer; // unused
  walletAddress?: string; // unused
}) => {
  return ['wallet', masa?.config.networkName];
};

export const useWalletQuery = ({
  masa,
  signer,
}: {
  masa?: Masa;
  signer?: Signer;
  walletAddress?: string; // unused
}) => {
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
  } = useQuery<string | undefined>(queryKey, () => signer?.getAddress(), {
    enabled: !!masa, //  && !!signer,
    retry: false,
    onSuccess: (address: string | undefined) => {
      if (masa?.config.verbose) {
        console.info('wallet address', address);
      }
    },
  });

  return {
    walletAddress,
    status,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

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
  const { walletAddress, status, isLoading, isFetching, error, refetch } =
    useWalletQuery({ masa, signer });

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
