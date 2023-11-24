import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { queryClient } from '../masa-client/query-client';

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
  } = useQuery(
    {
      queryKey: ['green', { masaAddress, masaNetwork, persist: false }],
      enabled: false,
      queryFn: getGreensAsync,
    },
    queryClient
  );

  return {
    greens,
    isLoadingGreens,
    isGreensLoading: isLoadingGreens,
    reloadGreens,
    getGreens: reloadGreens,
  };
};
