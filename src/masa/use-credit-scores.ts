import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import { CreditScoreDetails } from '@masa-finance/masa-sdk';
import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useCanQuery } from '../hooks/use-can-query';
import { queryClient } from '../masa-client/query-client';

export const useCreditScores = () => {
  const { masaAddress, masaNetwork, masa } = useMasaClient();
  const canQuery = useCanQuery();

  const isCreditScoreAvailableInNetwork = useMemo(
    () => masa?.creditScore.isContractAvailable ?? false,
    [masa]
  );

  const [, getCreditScoresAsync] = useAsyncFn(async (): Promise<
    CreditScoreDetails[] | null
  > => {
    if (!canQuery) return null;

    if (!isCreditScoreAvailableInNetwork) {
      return null;
    }

    let csResult: CreditScoreDetails[] | undefined;

    try {
      csResult = await masa?.creditScore.list();
    } catch (error: unknown) {
      console.error('ERROR loading credit scores', error);
    }

    return csResult ?? null;
  }, [canQuery, isCreditScoreAvailableInNetwork, masa?.creditScore]);

  const {
    isFetching: isLoadingCreditScores,
    data: creditScores,
    refetch: getCreditScores,
  } = useQuery(
    {
      queryKey: [
        'credit-scores',
        {
          // sessionAddress,
          masaAddress,
          masaNetwork,
          persist: false,
        },
      ],
      enabled: false,
      queryFn: getCreditScoresAsync,
    },
    queryClient
  );

  return {
    getCreditScores,
    isLoadingCreditScores,
    creditScores,
    isCreditScoreAvailableInNetwork,

    isCreditScoresLoading: isLoadingCreditScores,
    reloadCreditScores: getCreditScores,
  };
};
