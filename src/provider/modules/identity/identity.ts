import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { Masa, NetworkName, PaymentMethod } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

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
  reloadIdentity: () => void;
  error: unknown;
} => {
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
      enabled: !!masa && !!walletAddress,
      retry: false,
      onSuccess: (identity?: { identityId?: BigNumber; address?: string }) => {
        if (masa?.config.verbose) {
          console.info({ identity, network: masa?.config.networkName });
        }
      },
    }
  );

  const handlePurchaseIdentity = useCallback(async (): Promise<boolean> => {
    const result = await masa?.identity.create();
    await queryClient.invalidateQueries(['identity']);

    return !!result?.success;
  }, [masa]);

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
      await queryClient.invalidateQueries(['identity']);
      await queryClient.invalidateQueries(['soulnames']);

      return !!result?.success;
    },
    [masa]
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
