import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { ICreditScore, Masa } from '@masa-finance/masa-sdk';
import { BigNumber, Signer } from 'ethers';
import { queryClient } from '../../masa-query-client';

export type OnSuccessInput = {
  creditScores?: {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: ICreditScore;
  }[];
};

export const getCreditScoresQueryKey = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  signer?: Signer; // unused
  walletAddress?: string; // unused
}) => ['credit-scores', walletAddress, masa?.config.networkName];

export const useCreditScoresQuery = ({
  masa,
  walletAddress,
  identity,
}: {
  masa?: Masa;
  walletAddress?: string;
  identity?: {
    identityId?: BigNumber;
    address?: string;
  };
}) => {
  const queryKey: (string | undefined)[] = useMemo(
    () => ['credit-scores', walletAddress, masa?.config.networkName],
    [walletAddress, masa]
  );

  const {
    data: creditScores,
    status,
    isLoading,
    isFetching,
    refetch: reloadCreditScores,
    error,
  } = useQuery<
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: ICreditScore;
      }[]
    | undefined
  >(queryKey, () => masa?.creditScore.list(), {
    enabled: !!masa && !!walletAddress && !!identity?.identityId,
    retry: false,
    onSuccess: (
      credScores?: {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: ICreditScore;
      }[]
    ) => {
      if (masa?.config.verbose) {
        console.info({
          creditScores: credScores,
          network: masa?.config.networkName,
        });
      }
    },
  });

  const invalidateCreditScores = useCallback(
    async () => queryClient.invalidateQueries(['credit-scores']),
    []
  );

  return {
    creditScores,
    status,
    isLoading,
    isFetching,
    reloadCreditScores,
    invalidateCreditScores,
    error,
  };
};

export type UseCreditScoresReturnType = {
  creditScores?: {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: ICreditScore;
  }[];
  handleCreateCreditScore: () => Promise<boolean | undefined>;
  status: string;
  isCreditScoresLoading: boolean;
  reloadCreditScores: () => void;
  invalidateCreditScores: () => void;
  error: unknown;
};

export const useCreditScores = (
  masa?: Masa,
  walletAddress?: string,
  identity?: {
    identityId?: BigNumber;
    address?: string;
  }
): UseCreditScoresReturnType => {
  const {
    creditScores,
    status,
    isLoading,
    isFetching,
    reloadCreditScores,
    invalidateCreditScores,
    error,
  } = useCreditScoresQuery({ masa, walletAddress, identity });

  const handleCreateCreditScore = useCallback(async (): Promise<
    boolean | undefined
  > => {
    const response = await masa?.creditScore.create();
    await invalidateCreditScores();
    return response?.success;
  }, [masa, invalidateCreditScores]);

  return {
    creditScores,
    isCreditScoresLoading: isLoading || isFetching,
    handleCreateCreditScore,
    reloadCreditScores,
    invalidateCreditScores,
    status,
    error,
  };
};
