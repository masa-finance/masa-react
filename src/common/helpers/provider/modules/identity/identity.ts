import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { Masa } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const useIdentity = (
  masa: Masa | null,
  walletAddress: string | undefined
): {
  identity:
    | {
        identityId?: BigNumber | undefined;
        address?: string | undefined;
      }
    | undefined;
  handlePurchaseIdentity: () => void;
  status: string;
  isLoading: boolean;
  error: unknown;
} => {
  const {
    data: identity,
    status,
    isLoading,
    error,
  } = useQuery(
    `identity-${walletAddress}`,
    () => masa?.identity.load(walletAddress),
    {
      enabled: !!masa && !!walletAddress,
    }
  );

  console.log('IDENTITY', {
    identity,
    error,
    ENABLED: !!masa && !!walletAddress,
  });

  const handlePurchaseIdentity = useCallback(async () => {
    await masa?.identity.create();
    await queryClient.invalidateQueries(`identity-${walletAddress}`);
  }, [masa]);

  return { identity, handlePurchaseIdentity, status, isLoading, error };
};
