import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';

import { useMasaClient } from '../masa-client/use-masa-client';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

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
  } = useQuery({
    enabled: !!masaAddress && !!masaNetwork,
    context: MasaQueryClientContext,
    queryKey: ['soulnames', { masaAddress, masaNetwork, persist: false }],
    queryFn: getSoulnamesAsync,
  });

  return {
    soulnames,
    isLoadingSoulnames,
    getSoulnames,

    isSoulnamesLoading: isLoadingSoulnames,
    reloadSoulnames: getSoulnames,
  };
};
