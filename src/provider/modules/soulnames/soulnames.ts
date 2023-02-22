import { useQuery } from 'react-query';
import { Masa, SoulNameDetails } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';

export const useSoulnames = (
  masa: Masa | null,
  walletAddress: string | undefined,
  identity:
    | {
        identityId?: BigNumber | undefined;
        address?: string | undefined;
      }
    | undefined
): {
  soulnames: SoulNameDetails[] | undefined;
  status: string;
  isLoading: boolean;
  error: unknown;
} => {
  const queryKey: (string | undefined)[] = useMemo(() => {
    return ['soulnames', walletAddress, masa?.config.network];
  }, [walletAddress, masa]);

  console.log(queryKey);

  const {
    data: soulnames,
    status,
    isLoading,
    error,
  } = useQuery(queryKey, () => masa?.soulName.list(), {
    enabled:
      !!masa &&
      masa.config.network !== 'unknown' &&
      !!walletAddress &&
      !!identity?.identityId,
    retry: false,
  });

  return { soulnames, status, isLoading, error };
};
