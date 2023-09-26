import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

export const useSBT = ({ tokenAddress }: { tokenAddress: string }) => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();

  const { hasSession, sessionAddress } = useSession();
  const currentTokenAddress = useMemo(() => tokenAddress, [tokenAddress]);

  const [, getSBTsAsync] = useAsyncFn(async () => {
    try {
      const { list } = (await masa?.sbt.connect(currentTokenAddress)) || {};

      return await (list?.(masaAddress) ?? null);
    } catch (error: unknown) {
      const err = error as Error;
      console.warn('ERROR loading SBTs', err.message);
      return [{ message: err.message }];
    }
  }, [masa, masaAddress, currentTokenAddress]);

  const {
    data: SBTs,
    isFetching: isLoadingSBTs,
    refetch: getSBTs,
  } = useQuery({
    context: MasaQueryClientContext,
    queryKey: [
      'sbt',
      { masaAddress, sessionAddress, masaNetwork, persist: false },
    ],
    enabled: !!hasSession && !!sessionAddress && !!masaAddress && !!masaNetwork,
    queryFn: getSBTsAsync,
  });

  return {
    SBTs,
    isLoadingSBTs,
    getSBTs,
    currentTokenAddress,
  };
};
