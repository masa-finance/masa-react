import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import { QcContext } from '../masa-provider';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useIdentity } from './use-identity';
import { useSession } from './use-session';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useNetwork } from '../wallet-client/network';

export const useCreditScores = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const { identity } = useIdentity();
  const { sessionAddress, hasSession } = useSession();
  const { isDisconnected } = useWallet();
  const { activeNetwork } = useNetwork();

  const [, loadCreditScores] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!sessionAddress) return null;
    if (!activeNetwork) return null;
    if (isDisconnected) return null;
    if (!hasSession) return null;
    const csResult = await masa?.creditScore.list();
    if (!csResult) return null;
    return csResult;
  }, [masa, sessionAddress, activeNetwork, isDisconnected, hasSession]);

  const {
    isFetching: isLoadingCreditScores,
    data: creditScores,
    refetch: getCreditScores,
  } = useQuery({
    queryKey: [
      'credit-scores',
      {
        masaAddress,
        identityId: identity?.identityId,
        masaNetwork,
        persist: false,
      },
    ],
    enabled: !!masaAddress && !!masaNetwork && !!identity?.identityId,
    context: QcContext,
    queryFn: async () => loadCreditScores(),
  });

  return {
    getCreditScores,
    isLoadingCreditScores,
    creditScores,
  };
};
