import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import { QcContext } from '../masa-provider';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useIdentity } from './use-identity';
import { useCanQuery } from '../hooks/use-can-query';
import { useSession } from './use-session';

export const useCreditScores = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const canQuery = useCanQuery();
  const { identity } = useIdentity();
  const { hasSession, sessionAddress } = useSession();
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
  } = useQuery({
    queryKey: [
      'credit-scores',
      { sessionAddress, masaAddress, masaNetwork, persist: false },
    ],
    enabled:
      !!hasSession &&
      !!sessionAddress &&
      !!masaAddress &&
      !!masaNetwork &&
      !!identity?.identityId,
    context: QcContext,
    queryFn: async () => getCreditScoresAsync(),
  });

  return {
    getCreditScores,
    isLoadingCreditScores,
    creditScores,
  };
};
