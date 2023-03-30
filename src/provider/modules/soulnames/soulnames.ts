import { useQuery } from 'react-query';
import {
  Masa,
  NetworkName,
  PaymentMethod,
  SoulNameDetails,
} from '@masa-finance/masa-sdk';
import { useCallback, useMemo } from 'react';
import { queryClient } from '../../masa-query-client';

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
    paymentMethod: PaymentMethod
  ) => Promise<boolean | any>;
  error: unknown;
} => {
  const queryKey: (string | NetworkName | undefined)[] = useMemo(() => {
    return ['soulnames', walletAddress, masa?.config.networkName];
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
      enabled: !!masa && !!walletAddress,
      retry: false,
      onSuccess: (soulNames?: SoulNameDetails[]) => {
        if (masa?.config.verbose) {
          console.info({ soulNames, network: masa?.config.networkName });
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
      try {
        const result = await masa?.soulName.create(
          paymentMethod,
          soulname,
          registrationPeriod
        );

        await queryClient.invalidateQueries(['soulnames']);

        return !!result?.success;
      } catch (e: unknown) {
        console.log('ERROR', e);
        return { success: false, errorCode: 'error' };
      }
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
