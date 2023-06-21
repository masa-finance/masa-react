import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { QcContext } from '../masa-provider';
import { useSession } from './use-session';

export const useGreen = () => {
  const { sdk: masa, masaAddress, masaNetwork } = useMasaClient();
  const { hasSession, sessionAddress } = useSession();
  const [, getGreensAsync] = useAsyncFn(async () => {
    const greensResult = await masa?.green.list();
    return greensResult ?? null;
  }, [masa]);
  const { data: greens, isFetching: isLoadingGreens } = useQuery({
    context: QcContext,
    queryKey: [
      'green',
      { masaAddress, sessionAddress, masaNetwork, persist: false },
    ],
    enabled: !!sessionAddress && !!hasSession && !!masaAddress && !!masaNetwork,
    queryFn: async () => getGreensAsync(),
  });

  return {
    greens,
    isLoadingGreens,
  };
};
