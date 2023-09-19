import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';

import { SoulNameDetails } from '@masa-finance/masa-sdk';
import { useCallback } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

export const useSoulNames = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const { hasSession, sessionAddress } = useSession();
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
    enabled: !!sessionAddress && !!hasSession && !!masaAddress && !!masaNetwork,
    context: MasaQueryClientContext,
    queryKey: [
      'soulnames',
      { sessionAddress, masaAddress, masaNetwork, persist: false },
    ],
    queryFn: getSoulnamesAsync,
  });

  const loadSoulnameDetails = useCallback(
    async (soulName: string): Promise<SoulNameDetails | undefined> => {
      return masa?.soulName.loadSoulNameByName(soulName);
    },
    [masa?.soulName]
  );

  return {
    soulnames,
    isLoadingSoulnames,
    getSoulnames,
    loadSoulnameDetails,

    isSoulnamesLoading: isLoadingSoulnames,
    reloadSoulnames: getSoulnames,
  };
};
