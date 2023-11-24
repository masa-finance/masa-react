import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useSoulNamesPurchase = () => {
  const { masa } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [
    {
      loading: isPurchasingSoulName,
      value: hasPurchasedSoulName,
      error: errorPurchaseSoulName,
    },
    purchaseSoulName,
  ] = useAsyncFn(
    async (
      soulname: string,
      registrationPeriod: number,
      paymentMethod: PaymentMethod,
      style?: string
    ) => {
      try {
        const result = await masa?.soulName.create(
          paymentMethod,
          soulname,
          registrationPeriod,
          undefined,
          style
        );
        await queryClient.invalidateQueries(['soulnames']);
        return result;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
          throw error;
        }

        throw new Error('Unknown error while purchasing a soulname');
      }
    },
    [masa, queryClient]
  );

  return {
    isPurchasingSoulName,
    hasPurchasedSoulName,
    purchaseSoulName,
    errorPurchaseSoulName,
  };
};
