import { useQuery } from '@tanstack/react-query';
import { useAsync } from 'react-use';
import { QcContext } from '../masa-provider';
import { useMasaClient } from '../masa-client/use-masa-client';

export const useSoulNames = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const {
    data: soulnames,
    isFetching: isLoadingSoulnames,
    refetch: getSoulnames,
  } = useQuery({
    enabled: !!masa && !!masaAddress && !!masaNetwork,
    context: QcContext,
    queryKey: ['soulnames', { masaAddress, masaNetwork, persist: false }],
    queryFn: async () => masa?.soulName.list(),
  });

  useAsync(async () => getSoulnames(), [getSoulnames]);
  return {
    soulnames,
    isLoadingSoulnames,
    getSoulnames,
  };
};
