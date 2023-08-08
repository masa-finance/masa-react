import { useAsyncFn } from 'react-use';
import { CreateSoulNameResult } from '@masa-finance/masa-sdk';
import { useSoulNamesPurchase } from '../../../../masa/use-soulnames-purchase';
import { useIdentityPurchase } from '../../../../masa/use-identity-purchase';
import { useConfig } from '../../../../base-provider';
import { useIdentity } from '../../../../masa/use-identity';
import { useCreateSoulnameModal } from './CreateSoulnameProvider';

// const errorMessages = {
//   UNPREDICTABLE_GAS_LIMIT:
//     'You do not have sufficient funds in you wallet. Please add funds to your wallet and try again',
//   ACTION_REJECTED: 'Transaction rejected by the user.',
// };

export const useRegisterSoulname = ({
  onMintSuccess,
  onMintError,
  onRegisterFinish,
}: Partial<{
  onMintSuccess?: (
    result: CreateSoulNameResult
  ) => void;
  onMintError?: () => void;
  onRegisterFinish?: () => void;
}>) => {
  const { soulNameStyle } = useConfig();

  const { identity } = useIdentity();
  const { purchaseSoulName } = useSoulNamesPurchase();
  const { purchaseIdentityWithSoulName } = useIdentityPurchase();
  const {
    soulname,
    registrationPeriod,
    paymentMethod,
    // soulNameError,
    // registrationPrice,
  } = useCreateSoulnameModal();

  const [
    {
      value: hasRegisteredSoulname,
      loading: isRegisteringSoulname,
      error: errorRegisterSoulname,
    },
    onRegisterSoulname,
  ] = useAsyncFn(async () => {
    try {
      if (identity && identity.identityId) {
        const result = await purchaseSoulName(
          soulname,
          registrationPeriod,
          paymentMethod,
          soulNameStyle
        );

        if (result instanceof Error) {
          throw result;
        }

        if (result) {
          onMintSuccess?.(result);
        }

        onRegisterFinish?.();

        return result;
      }
    } catch (error_: unknown) {
      console.log('ERROR registerSoulname', error_);
      onMintError?.();

      throw error_ as Error;
    }

    try {
      const result = await purchaseIdentityWithSoulName(
        paymentMethod,
        soulname,
        registrationPeriod,
        soulNameStyle
      );

      if (result instanceof Error) {
        throw result;
      }

      if (result) {
        onMintSuccess?.(result);
      }

      onRegisterFinish?.();

      return result;
    } catch (error: unknown) {
      // const errorObject = error as {
      //   code: string;
      //   message: string;
      // };

      // const subtitle =
      //   (errorMessages?.[errorObject.code] as string | undefined) ??
      //   ('Unknown error' as string);

      // console.error(`Minting failed! ${errorObject.message}`);

      console.log('ERROR registerSoulname catch2', error);
      onMintError?.();

      throw error as Error;
      // return {
      //   title: '',
      //   subtitle,
      // };
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
