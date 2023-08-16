import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Masa, PaymentMethod } from '@masa-finance/masa-sdk';
import type { BigNumber, Signer } from 'ethers';
import { useAsync } from 'react-use';
import { queryClient } from '../../masa-query-client';

export const getIdentityQueryKey = ({
  walletAddress,
  masa,
}: {
  walletAddress?: string;
  masa?: Masa;
  signer?: Signer; // unused here
}) => ['identity', walletAddress, masa?.config.networkName];

export const useIdentityQuery = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
}) => {
  const queryKey: (string | undefined)[] = useMemo(
    () => ['identity', walletAddress, masa?.config.networkName],
    [walletAddress, masa]
  );

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
      onSuccess: (identityFromQuery?: {
        identityId?: BigNumber;
        address?: string;
      }) => {
        if (masa?.config.verbose) {
          console.info({
            identity: identityFromQuery,
            network: masa?.config.networkName,
          });
        }
      },
    }
  );

  const invalidateIdentity = useCallback(
    async () => queryClient.invalidateQueries(['identity']),
    []
  );

  const invalidateSoulnames = useCallback(
    async () => queryClient.invalidateQueries(['soulnames']),
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
    registrationPeriod: number,
    style?: string
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
      registrationPeriod: number,
      style?: string
    ) => {
      const result = await masa?.identity.createWithSoulName(
        paymentMethod,
        soulname,
        registrationPeriod,
        style
      );
      await invalidateIdentity();
      await invalidateSoulnames();

      return !!result?.success;
    },
    [masa, invalidateIdentity, invalidateSoulnames]
  );

  useAsync(async () => {
    await reloadIdentity();
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
