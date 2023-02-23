import { useQuery } from 'react-query';
import { Masa, SoulNameDetails } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';

export const useSoulnames = (
  masa?: Masa,
  walletAddress?: string,
  identity?: {
    identityId?: BigNumber | undefined;
    address?: string | undefined;
  }
): {
  soulnames: SoulNameDetails[] | undefined;
  status: string;
  isSoulnamesLoading: boolean;
  reloadSoulnames: () => void;
  error: unknown;
} => {
  const queryKey: (string | undefined)[] = useMemo(() => {
    return ['soulnames', walletAddress, masa?.config.network];
  }, [walletAddress, masa]);

  const {
    data: soulnames,
    status,
    isLoading,
    isFetching,
    refetch: reloadSoulnames,
    error,
  } = useQuery<SoulNameDetails[] | undefined>(
    queryKey,
    () => masa?.soulName.list(),
    {
      enabled: !!masa && !!walletAddress && !!identity?.identityId,
      retry: false,
      onSuccess: (soulNames?: SoulNameDetails[]) => {
        if (masa?.config.verbose) {
          console.log({ soulNames, network: masa?.config.network });
        }
      },
    }
  );

  return {
    soulnames,
    isSoulnamesLoading: isLoading || isFetching,
    reloadSoulnames,
    status,
    error,
  };
};
