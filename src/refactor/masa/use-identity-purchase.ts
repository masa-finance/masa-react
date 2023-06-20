import { useAsyncFn } from 'react-use';
import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useMasaClient } from '../masa-client/use-masa-client';


export const useIdentityPurchase = () => {
  const { sdk: masa } = useMasaClient();
  const [
    { loading: isPurchasingIdentity, value: hasPurchasedIdentity },
    purchaseIdentity,
  ] = useAsyncFn(async () => {
    const purchasedIdentity = await masa?.identity.create();
    return purchasedIdentity?.success;
  }, [masa]);

  const [
    {
      value: hasPurchasedIdentityWithSoulName,
      loading: isPurchasingIdentityWithSoulName,
    },
    purchaseIdentityWithSoulName,
  ] = useAsyncFn(
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

      return !!result?.success;
    },
    [masa]
  );

  return {
    purchaseIdentity,
    isPurchasingIdentity,
    hasPurchasedIdentity,

    purchaseIdentityWithSoulName,
    isPurchasingIdentityWithSoulName,
    hasPurchasedIdentityWithSoulName,
  };
};
