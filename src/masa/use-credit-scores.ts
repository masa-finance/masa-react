import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useCanQuery } from '../hooks/use-can-query';
import { queryClient } from '../masa-client/query-client';

export const useCreditScores = () => {
  const { masaAddress, masaNetwork, masa } = useMasaClient();
  const canQuery = useCanQuery();
  const [, getCreditScoresAsync] = useAsyncFn(async () => {
    if (!canQuery) return null;
    const csResult = await masa?.creditScore.list();

    if (!csResult) return null;
    return csResult;
  }, [masa, canQuery]);

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

    isCreditScoresLoading: isLoadingCreditScores,
    reloadCreditScores: getCreditScores,
  };
};
