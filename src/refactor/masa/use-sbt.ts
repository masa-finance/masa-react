import { useQuery } from '@tanstack/react-query';
import { constants } from 'ethers';
import { QcContext } from '../masa-provider';
import { useMasaClient } from '../masa-client/use-masa-client';

export const useSBT = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const tokenAddress = constants.AddressZero;
  const {
    data: SBTs,
    isFetching: isLoadingSBTs,
    refetch: getSBTs,
  } = useQuery({
    context: QcContext,
    queryKey: ['sbt', { masaAddress, masaNetwork, persist: false }],
    enabled: !!masaAddress && !!masaNetwork,
    queryFn: async () => {
      const { list } = (await masa?.sbt.connect(tokenAddress)) || {};
      if (!list) return null;
      return list(masaAddress);
    },
  });

  return {
    SBTs,
    isLoadingSBTs,
    getSBTs,
  };
};
