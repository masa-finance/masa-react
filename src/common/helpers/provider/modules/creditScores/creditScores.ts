import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-provider';

export const useCreditScores = function (masa, walletAddress, identity) {
  const { data, status, isLoading, error } = useQuery(
    `credit-scores-${walletAddress}`,
    () => masa?.creditScore.list(),
    { enabled: !!masa && !!walletAddress && !!identity?.identityId }
  );

  const handleCreateCreditScore = useCallback(async () => {
    const response = await masa?.creditScore.create();

    queryClient.invalidateQueries(`credit-scores-${walletAddress}`);

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
