import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { Masa, NetworkName, PaymentMethod } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const getIdentityQueryKey = ({
  walletAddress,
  masa,
}: {
  walletAddress?: string;
  masa?: Masa;
  signer?: any; // unused here
}) => {
  return ['identity', walletAddress, masa?.config.networkName];
};

export const useIdentityQuery = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
}) => {
  const queryKey: (string | NetworkName | undefined)[] = useMemo(() => {
    return ['identity', walletAddress, masa?.config.networkName];
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
      enabled: true, // !!masa && !!walletAddress,
      retry: false,
      onSuccess: (identity?: { identityId?: BigNumber; address?: string }) => {
        if (masa?.config.verbose) {
          console.info({ identity, network: masa?.config.networkName });
        }
      },
    }
  );

  const invalidateIdentity = useCallback(
    async () => await queryClient.invalidateQueries(['identity']),
    []
  );

  const invalidateSoulnames = useCallback(
    async () => await queryClient.invalidateQueries(['soulnames']),
    []
  );

  return {
    identity,
    status,
    isLoading,
    isFetching,
    reloadIdentity,
    error,
    invalidateIdentity,
    invalidateSoulnames,
  };
};

export const useIdentity = (
  masa?: Masa,
  walletAddress?: string
): {
  identity?: {
    identityId?: BigNumber;
    address?: string;
  };
  handlePurchaseIdentity: () => Promise<boolean>;
  handlePurchaseIdentityWithSoulname: (
    paymentMethod: PaymentMethod,
    soulname: string,
    registrationPeriod: number
  ) => Promise<boolean>;
  status: string;
  isIdentityLoading: boolean;
  reloadIdentity: () => Promise<unknown>;
  error: unknown;
} => {
  const {
    identity,
    status,
    isLoading,
    isFetching,
    reloadIdentity,
    error,
    invalidateIdentity,
    invalidateSoulnames,
  } = useIdentityQuery({ masa, walletAddress });
  const handlePurchaseIdentity = useCallback(async (): Promise<boolean> => {
    const result = await masa?.identity.create();
    await invalidateIdentity();

    return !!result?.success;
  }, [masa, invalidateIdentity]);

  const handlePurchaseIdentityWithSoulname = useCallback(
    async (
      paymentMethod: PaymentMethod,
      soulname: string,
      registrationPeriod: number
    ) => {
      const result = await masa?.identity.createWithSoulName(
        paymentMethod,
        soulname,
        registrationPeriod
      );
      await invalidateIdentity();
      await invalidateSoulnames();

      return !!result?.success;
    },
    [masa, invalidateIdentity, invalidateSoulnames]
  );

  useEffect(() => {
    reloadIdentity();
  }, [walletAddress, reloadIdentity]);

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
