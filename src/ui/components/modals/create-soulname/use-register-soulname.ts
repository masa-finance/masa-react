import { useAsyncFn } from 'react-use';
import { CreateSoulNameResult } from '@masa-finance/masa-sdk';
import { useSoulNamesPurchase } from '../../../../masa/use-soulnames-purchase';
import { useIdentityPurchase } from '../../../../masa/use-identity-purchase';
import { useConfig } from '../../../../base-provider';
import { useIdentity } from '../../../../masa/use-identity';
import { useCreateSoulnameModal } from './CreateSoulnameProvider';

export const useRegisterSoulname = ({
  onMintSuccess,
  onMintError,
  onRegisterFinish,
}: Partial<{
  onMintSuccess?: (result: CreateSoulNameResult) => void;
  onMintError?: () => void;
  onRegisterFinish?: () => void;
}>) => {
  const { soulNameStyle } = useConfig();

  const { identity } = useIdentity();
  const { purchaseSoulName } = useSoulNamesPurchase();
  const { purchaseIdentityWithSoulName } = useIdentityPurchase();
  const { soulname, registrationPeriod, paymentMethod } =
    useCreateSoulnameModal();

  const [
    {
      value: hasRegisteredSoulname,
      loading: isRegisteringSoulname,
      error: errorRegisterSoulname,
    },
    onRegisterSoulname,
  ] = useAsyncFn(async () => {
    try {
      if (identity?.identityId) {
        const result = await purchaseSoulName(
          soulname,
          registrationPeriod,
          paymentMethod,
          soulNameStyle
        );

        if (result instanceof Error || !result || !result.success) {
          onMintError?.();
          if (result instanceof Error) throw result;

          throw new Error('Unexpected error');
        }

        if (result?.success) {
          console.log({ result });
          onMintSuccess?.(result);
        }

        onRegisterFinish?.();

        return result;
      }
    } catch (error: unknown) {
      console.error('ERROR registerSoulname', error);
      onMintError?.();

      throw error;
    }

    try {
      const result = await purchaseIdentityWithSoulName(
        paymentMethod,
        soulname,
        registrationPeriod,
        soulNameStyle
      );

      if (result instanceof Error || !result || !result.success) {
        onMintError?.();
        if (result instanceof Error) throw result;

        throw new Error('Unexpected error');
      }

      if (result?.success) {
        onMintSuccess?.(result);
      }

      onRegisterFinish?.();

      return result;
    } catch (error: unknown) {
      console.error('ERROR registerSoulname catch2', error);
      onMintError?.();

      throw error;
    }
  }, [
    onRegisterFinish,
    soulname,
    identity,
    paymentMethod,
    registrationPeriod,
    // registrationPrice,
    // soulNameError,
    purchaseIdentityWithSoulName,
    purchaseSoulName,
    soulNameStyle,
    onMintSuccess,
    onMintError,
  ]);

  return {
    onRegisterSoulname,
    hasRegisteredSoulname,
    isRegisteringSoulname,
    errorRegisterSoulname,
  };
};
