import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { Masa } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const useCreditScores = (
  masa: Masa | null,
  walletAddress: string | undefined,
  identity:
    | {
        identityId?: BigNumber | undefined;
        address?: string | undefined;
      }
    | undefined
) => {
  const { data, status, isLoading, error } = useQuery(
    `credit-scores-${walletAddress}`,
    () => masa?.creditScore.list(),
    { enabled: !!masa && !!walletAddress && !!identity?.identityId }
  );

  const handleCreateCreditScore = useCallback(async () => {
    const response = await masa?.creditScore.create();

    await queryClient.invalidateQueries(`credit-scores-${walletAddress}`);

    return response?.success;
  }, [masa]);

  return {
    creditScores: data,
    handleCreateCreditScore,
    status,
    isLoading,
    error,
  };
};
