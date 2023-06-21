import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAsyncFn } from 'react-use';
import { QcContext } from '../masa-provider';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';

export const useSBT = ({ tokenAddress }: { tokenAddress: string }) => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();

  const { hasSession, sessionAddress } = useSession();
  const currentTokenAddress = useMemo(() => tokenAddress, [tokenAddress]);

  const [, getSBTsAsync] = useAsyncFn(async () => {
    const { list } = (await masa?.sbt.connect(currentTokenAddress)) || {};

    return list?.(masaAddress) ?? null;
  }, [masa, masaAddress, currentTokenAddress]);

  const {
    data: SBTs,
    isFetching: isLoadingSBTs,
    refetch: getSBTs,
  } = useQuery({
    context: QcContext,
    queryKey: [
      'sbt',
      { masaAddress, sessionAddress, masaNetwork, persist: false },
    ],
    enabled: !!hasSession && !!sessionAddress && !!masaAddress && !!masaNetwork,
    queryFn: async () => getSBTsAsync(),
  });

  return {
    SBTs,
    isLoadingSBTs,
    getSBTs,
    currentTokenAddress,
  };
};
