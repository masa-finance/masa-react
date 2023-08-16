import { useQuery } from 'react-query';
import { Masa, PaymentMethod, SoulNameDetails } from '@masa-finance/masa-sdk';
import { useCallback, useMemo } from 'react';
import type { Signer } from 'ethers';
import { queryClient } from '../../masa-query-client';

export const getSoulnamesQueryKey = ({
  walletAddress,
  masa,
}: {
  walletAddress?: string;
  masa?: Masa;
  signer?: Signer; // unused here
}) => ['soulnames', walletAddress, masa?.config.networkName];

export const useSoulnamesQuery = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
}) => {
  const queryKey: (string | undefined)[] = useMemo(
    () => ['soulnames', walletAddress, masa?.config.networkName],
    [walletAddress, masa]
  );

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
      enabled: true, // !!masa && !!walletAddress,
      retry: false,
      onSuccess: (soulNames?: SoulNameDetails[]) => {
        if (masa?.config.verbose) {
          console.info({ soulNames, network: masa?.config.networkName });
        }
      },
    }
  );

  return {
    soulnames,
    status,
    isLoading,
    isFetching,
    reloadSoulnames,
    error,
  };
};

export const useSoulnames = (
  masa?: Masa,
  walletAddress?: string
): {
  soulnames?: SoulNameDetails[];
  status: string;
  isSoulnamesLoading: boolean;
  reloadSoulnames: () => void;
  handlePurchaseSoulname: (
    soulname: string,
    registrationPeriod: number,
    paymentMethod: PaymentMethod,
    style?: string
  ) => Promise<boolean>;
  error: unknown;
} => {
  const { soulnames, status, isLoading, isFetching, reloadSoulnames, error } =
    useSoulnamesQuery({ masa, walletAddress });

  const handlePurchaseSoulname = useCallback(
    async (
      soulname: string,
      registrationPeriod: number,
      paymentMethod: PaymentMethod,
      style?: string
    ) => {
      const result = await masa?.soulName.create(
        paymentMethod,
        soulname,
        registrationPeriod,
        undefined,
        style
      );

      await queryClient.invalidateQueries(['soulnames']);

      return !!result?.success;
    },
    [masa]
  );

  return {
    soulnames,
    isSoulnamesLoading: isLoading || isFetching,
    reloadSoulnames,
    handlePurchaseSoulname,
    status,
    error,
  };
};
