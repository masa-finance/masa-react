import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
// import { useSession } from './use-session';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

export const useGreen = () => {
  const { masa, masaAddress, masaNetwork } = useMasaClient();
  const [, getGreensAsync] = useAsyncFn(async () => {
    const greensResult = await masa?.green.list();
    return greensResult ?? null;
  }, [masa]);
  const {
    data: greens,
    isFetching: isLoadingGreens,
    refetch: reloadGreens,
  } = useQuery({
    context: MasaQueryClientContext,
    queryKey: ['green', { masaAddress, masaNetwork, persist: false }],
    enabled: false,
    queryFn: getGreensAsync,
  });

  return {
    greens,
    isLoadingGreens,
    isGreensLoading: isLoadingGreens,
    reloadGreens,
    getGreens: reloadGreens,
  };
};
