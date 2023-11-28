import { useAsyncFn } from 'react-use';
import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useIdentityPurchase = () => {
  const { masa } = useMasaClient();
  const queryClient = useMasaQueryClient();
  const [
    {
      loading: isPurchasingIdentity,
      value: hasPurchasedIdentity,
      error: purchaseIdentityError,
    },
    purchaseIdentity,
  ] = useAsyncFn(async () => {
    try {
      const purchasedIdentity = await masa?.identity.create();
      await queryClient.invalidateQueries({
        queryKey: ['identity'],
      });
      return purchasedIdentity?.success;
    } catch (error: unknown) {
      console.error('ERROR purchaseIdentity', { error });
      throw error;
    }
  }, [queryClient, masa]);

  const [
    {
      value: hasPurchasedIdentityWithSoulName,
      loading: isPurchasingIdentityWithSoulName,
      error: purchaseIdentityWithSoulnameError,
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

        await queryClient.invalidateQueries({
          queryKey: ['identity'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['soulnames'],
        });

        return result;
      } catch (error: unknown) {
        console.error('ERROR purchaseIdentityWithSoulName', { error });
        throw error;
      }
    },
    [queryClient, masa]
  );

  return {
    purchaseIdentity,
    isPurchasingIdentity,
    hasPurchasedIdentity,
    purchaseIdentityError,

    purchaseIdentityWithSoulName,
    isPurchasingIdentityWithSoulName,
    hasPurchasedIdentityWithSoulName,
    purchaseIdentityWithSoulnameError,
    // * old version
    handlePurchaseIdentity: purchaseIdentity,
    handlePurchaseIdentityWithSoulname: purchaseIdentityWithSoulName,
  };
};
