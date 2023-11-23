import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';

import { useMasaClient } from '../masa-client/use-masa-client';
import { queryClient } from '../masa-client/query-client';

export const useSoulNames = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const [, getSoulnamesAsync] = useAsyncFn(async (): Promise<
    string[] | undefined
  > => {
    let soulnameResults: string[] | undefined;

    if (masaAddress) {
      soulnameResults = await masa?.soulName.loadSoulNames(masaAddress);
    }

    return soulnameResults;
  }, [masa, masaAddress]);

  const {
    data: soulnames,
    isFetching: isLoadingSoulnames,
    refetch: getSoulnames,
  } = useQuery(
    {
      enabled: !!masaAddress && !!masaNetwork,
      queryKey: ['soulnames', { masaAddress, masaNetwork, persist: false }],
      queryFn: getSoulnamesAsync,
    },
    queryClient
  );

  return {
    soulnames,
    isLoadingSoulnames,
    getSoulnames,

    isSoulnamesLoading: isLoadingSoulnames,
    reloadSoulnames: getSoulnames,
  };
};
