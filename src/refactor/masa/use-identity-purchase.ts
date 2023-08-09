import { useAsyncFn } from 'react-use';
import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

const errorMessages = {
  UNPREDICTABLE_GAS_LIMIT:
    'You do not have sufficient funds in you wallet. Please add funds to your wallet and try again',
  ACTION_REJECTED: 'Transaction rejected by the user.',
};

export const useIdentityPurchase = () => {
  const { sdk: masa } = useMasaClient();
  const queryClient = useMasaQueryClient();
  const [
    { loading: isPurchasingIdentity, value: hasPurchasedIdentity },
    purchaseIdentity,
  ] = useAsyncFn(async () => {
    try {
      const purchasedIdentity = await masa?.identity.create();
      await queryClient.invalidateQueries(['identity']);
      return purchasedIdentity?.success;
    } catch (error: unknown) {
      const returnError = error as Error & {
        code?: string;
      };
      if (returnError.code && errorMessages[returnError.code]) {
        returnError.message = errorMessages[returnError.code] as string;
      }
      console.log('ERROR purchaseIdentity', { returnError });
      return returnError;
    }
  }, [queryClient, masa]);

  const [
    {
      value: hasPurchasedIdentityWithSoulName,
      loading: isPurchasingIdentityWithSoulName,
      error: purchaseIdentityError,
    },
    purchaseIdentityWithSoulName,
  ] = useAsyncFn(
    async (
      paymentMethod: PaymentMethod,
      soulname: string,
      registrationPeriod: number,
      style?: string
    ) => {
      try {
        const result = await masa?.identity.createWithSoulName(
          paymentMethod,
          soulname,
          registrationPeriod,
          style
        );

        await queryClient.invalidateQueries(['identity']);
        await queryClient.invalidateQueries(['soulnames']);
        return result;
      } catch (error: unknown) {
        const returnError = error as Error & {
          code?: string;
        };
        if (returnError.code && errorMessages[returnError.code]) {
          returnError.message = errorMessages[returnError.code] as string;
        }
        console.log('ERROR purchaseIdentityWithSoulName', { returnError });
        return returnError;
      }
    },
    [queryClient, masa]
  );

  return {
    purchaseIdentity,
    isPurchasingIdentity,
    hasPurchasedIdentity,
    purchaseIdentityWithSoulName,
    isPurchasingIdentityWithSoulName,
    hasPurchasedIdentityWithSoulName,
    purchaseIdentityError,
    // * old version
    handlePurchaseIdentity: purchaseIdentity,
    handlePurchaseIdentityWithSoulname: purchaseIdentityWithSoulName,
  };
};
