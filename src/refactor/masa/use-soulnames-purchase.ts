import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useSoulNamesPurchase = () => {
  const { sdk: masa } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [
    { loading: isPurchasingSoulName, value: hasPurchasedSoulName },
    purchaseSoulName,
  ] = useAsyncFn(
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
    [masa, queryClient]
  );

  return {
    isPurchasingSoulName,
    hasPurchasedSoulName,
    purchaseSoulName,
  };
};
