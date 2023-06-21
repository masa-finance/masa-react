import { useAsyncFn } from 'react-use';
import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useIdentityPurchase = () => {
  const { sdk: masa } = useMasaClient();
  const queryClient = useMasaQueryClient();
  const [
    { loading: isPurchasingIdentity, value: hasPurchasedIdentity },
    purchaseIdentity,
  ] = useAsyncFn(async () => {
    const purchasedIdentity = await masa?.identity.create();
    await queryClient.invalidateQueries(['identity']);
    return purchasedIdentity?.success;
  }, [queryClient, masa]);

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
      await queryClient.invalidateQueries(['identity']);
      await queryClient.invalidateQueries(['soulnames']);
      return !!result?.success;
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
  };
};
