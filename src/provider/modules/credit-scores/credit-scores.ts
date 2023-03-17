import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { ICreditScore, Masa } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const useCreditScores = (
  masa?: Masa,
  walletAddress?: string,
  identity?: {
    identityId?: BigNumber;
    address?: string;
  }
): {
  creditScores?:
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: ICreditScore;
      }[];
  handleCreateCreditScore: () => Promise<boolean | undefined>;
  status: string;
  isCreditScoresLoading: boolean;
  reloadCreditScores: () => void;
  error: unknown;
} => {
  const queryKey: (string | undefined)[] = useMemo(() => {
    return ['credit-scores', walletAddress, masa?.config.network];
  }, [walletAddress, masa]);

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
      creditScores?: {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: ICreditScore;
      }[]
    ) => {
      if (masa?.config.verbose) {
        console.info({ creditScores, network: masa?.config.network });
      }
    },
  });

  const handleCreateCreditScore = useCallback(async (): Promise<
    boolean | undefined
  > => {
    const response = await masa?.creditScore.create();
    await queryClient.invalidateQueries(queryKey);
    return response?.success;
  }, [masa, queryKey]);

  return {
    creditScores,
    isCreditScoresLoading: isLoading || isFetching,
    handleCreateCreditScore,
    reloadCreditScores,
    status,
    error,
  };
};
