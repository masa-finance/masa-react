import { useQuery } from 'react-query';
import { Masa, SoulNameDetails } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

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
  const {
    data: soulnames,
    status,
    isLoading,
    error,
  } = useQuery(`soulnames-${walletAddress}`, () => masa?.soulName.list(), {
    enabled: !!masa && !!walletAddress && !!identity?.identityId,
  });

  return { soulnames, status, isLoading, error };
};
