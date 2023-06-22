import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';

import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

export const useSoulNames = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const { hasSession, sessionAddress } = useSession();
  const [, getSoulnamesAsync] = useAsyncFn(async () => {
    const snResult = await masa?.soulName.list();
    return snResult ?? null;
  }, [masa]);

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

  //   useAsync(async () => {
  //     await getSoulnames();
  //   }, [getSoulnames]);
  return {
    soulnames,
    isLoadingSoulnames,
    getSoulnames,
  };
};
