import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';

import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { queryClient } from '../masa-client/query-client';

export const useSoulNames = () => {
  const { masaAddress, masaNetwork, masa } = useMasaClient();

  const isSoulnameAvailableInNetwork = useMemo(
    () => masa?.soulName.isContractAvailable ?? false,
    [masa]
  );

  const [, getSoulnamesAsync] = useAsyncFn(async (): Promise<
    string[] | null
  > => {
    let soulnameResults: string[] | undefined;

    if (!isSoulnameAvailableInNetwork) {
      return null;
    }

    if (masaAddress) {
      soulnameResults = await masa?.soulName.loadSoulNames(masaAddress);
    }

    return soulnameResults ?? null;
  }, [isSoulnameAvailableInNetwork, masa?.soulName, masaAddress]);

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
    isSoulnameAvailableInNetwork,

    isSoulnamesLoading: isLoadingSoulnames,
    reloadSoulnames: getSoulnames,
  };
};
