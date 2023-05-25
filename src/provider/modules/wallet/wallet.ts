import { useQuery } from 'react-query';
import { Masa, NetworkName } from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useAsync } from 'react-use';
import { queryClient } from '../../masa-query-client';

export const getWalletQueryKey = ({
  masa,
}: {
  masa?: Masa;
  signer?: Signer; // unused
  walletAddress?: string; // unused
}) => ['wallet', masa?.config.networkName];

export const useWalletQuery = ({
  masa,
  signer,
}: {
  masa?: Masa;
  signer?: Signer;
  walletAddress?: string; // unused
}) => {
  const queryKey: (string | NetworkName | undefined)[] = useMemo(
    () => ['wallet', masa?.config.networkName],
    [masa]
  );

  const {
    data: walletAddress,
    status,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<string | undefined>(queryKey, () => signer?.getAddress(), {
    enabled: false, // !!masa, //  && !!signer,
    retry: false,
    onSuccess: (address: string | undefined) => {
      if (masa?.config.verbose) {
        console.info('wallet address', address);
      }
    },
  });

  const invalidateIdentity = useCallback(
    async () => queryClient.invalidateQueries(['identity']),
    []
  );

  return {
    walletAddress,
    status,
    isLoading,
    isFetching,
    error,
    refetch,
    invalidateIdentity,
  };
};

export type UseWalletReturnType = {
  walletAddress?: string;
  isWalletLoading: boolean;
  hasWalletAddress: boolean;
  status: string;
  error: unknown;
  reloadWallet: () => Promise<unknown>;
};

export const useWallet = (
  masa?: Masa,
  signer?: Signer
): UseWalletReturnType => {
  const { walletAddress, status, isLoading, isFetching, error, refetch } =
    useWalletQuery({ masa, signer });

  useAsync(async () => {
    await refetch();
  }, [refetch, signer]);

  const hasWalletAddress = useMemo(() => !!walletAddress, [walletAddress]);

  return {
    walletAddress: signer ? walletAddress : undefined,
    isWalletLoading: isLoading || isFetching,
    hasWalletAddress,
    status,
    error,
    reloadWallet: refetch,
  };
};
