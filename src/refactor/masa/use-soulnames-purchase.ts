import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

const errorMessages = {
  UNPREDICTABLE_GAS_LIMIT:
    'You do not have sufficient funds in you wallet. Please add funds to your wallet and try again',
  ACTION_REJECTED: 'Transaction rejected by the user.',
};

export const useSoulNamesPurchase = () => {
  const { sdk: masa } = useMasaClient();
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
        return !!result?.success;
      } catch (error: unknown) {
        const returnError = error as Error & {
          code?: string;
        };
        if (returnError.code && errorMessages[returnError.code]) {
          returnError.message = errorMessages[returnError.code] as string;
        }
        console.log('ERROR purchaseSoulName', { returnError });
        return returnError;
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
