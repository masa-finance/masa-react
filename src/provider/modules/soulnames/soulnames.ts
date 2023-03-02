import { useQuery } from 'react-query';
import { Masa, PaymentMethod, SoulNameDetails } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import { queryClient } from '../../masa-query-client';

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
  handlePurchaseSoulname: (
    soulname: string,
    registrationPeriod: number,
    paymentMethod: PaymentMethod
  ) => Promise<boolean>;
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

  const handlePurchaseSoulname = useCallback(
    async (
      soulname: string,
      registrationPeriod: number,
      paymentMethod: PaymentMethod
    ) => {
      const result = await masa?.soulName.create(
        soulname,
        registrationPeriod,
        paymentMethod
      );
      await queryClient.invalidateQueries('soulnames');

      return !!result;
    },
    [masa, queryKey]
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
