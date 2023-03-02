import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { Masa, PaymentMethod } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const useIdentity = (
  masa?: Masa,
  walletAddress?: string
): {
  identity:
    | {
        identityId?: BigNumber;
        address?: string;
      }
    | undefined;
  handlePurchaseIdentity: () => void;
  handlePurchaseIdentityWithSoulname: (
    soulname: string,
    registrationPeriod: number,
    paymentMethod: PaymentMethod
  ) => Promise<boolean>;
  status: string;
  isIdentityLoading: boolean;
  reloadIdentity: () => void;
  error: unknown;
} => {
  const queryKey: (string | undefined)[] = useMemo(() => {
    return ['identity', walletAddress, masa?.config.network];
  }, [walletAddress, masa]);

  const {
    data: identity,
    status,
    isLoading,
    isFetching,
    refetch: reloadIdentity,
    error,
  } = useQuery<{ identityId?: BigNumber; address?: string } | undefined>(
    queryKey,
    () => masa?.identity.load(walletAddress),
    {
      enabled: !!masa && !!walletAddress,
      retry: false,
      onSuccess: (identity?: { identityId?: BigNumber; address?: string }) => {
        if (masa?.config.verbose) {
          console.log({ identity, network: masa?.config.network });
        }
      },
    }
  );

  const handlePurchaseIdentity = useCallback(async () => {
    await masa?.identity.create();
    await queryClient.invalidateQueries('identity');
  }, [masa, queryKey]);

  const handlePurchaseIdentityWithSoulname = useCallback(
    async (
      soulname: string,
      registrationPeriod: number,
      paymentMethod: PaymentMethod
    ) => {
      const result = await masa?.identity.createWithSoulName(
        soulname,
        registrationPeriod,
        paymentMethod
      );
      await queryClient.invalidateQueries('identity');

      return !!result;
    },
    [masa, queryKey]
  );

  return {
    identity,
    isIdentityLoading: isLoading || isFetching,
    handlePurchaseIdentity,
    handlePurchaseIdentityWithSoulname,
    reloadIdentity,
    status,
    error,
  };
};
