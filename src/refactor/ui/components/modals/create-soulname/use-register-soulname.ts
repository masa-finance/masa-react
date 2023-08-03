import { useAsyncFn } from 'react-use';
import { useSoulNamesPurchase } from '../../../../masa/use-soulnames-purchase';
import { useIdentityPurchase } from '../../../../masa/use-identity-purchase';
import { useConfig } from '../../../../base-provider';
import { useIdentity } from '../../../../masa/use-identity';
import { useCreateSoulnameModal } from './CreateSoulnameProvider';

const errorMessages = {
  UNPREDICTABLE_GAS_LIMIT:
    'You do not have sufficient funds in you wallet. Please add funds to your wallet and try again',
  ACTION_REJECTED: 'Transaction rejected by the user.',
};

export const useRegisterSoulname = ({
  onMintSuccess,
  onMintError,
  onRegisterFinish,
}: Partial<{
  onMintSuccess?: () => void;
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
    soulNameError,
    registrationPrice,
    setShowError,
  } = useCreateSoulnameModal();

  const [
    { value: hasRegisteredSoulname, loading: isRegisteringSoulname },
    onRegisterSoulname,
  ] = useAsyncFn(async () => {
    if (soulNameError || !registrationPrice) {
      setShowError(true);
      onMintError?.();
      return undefined;
    }

    try {
      if (identity && identity.identityId) {
        const result = await purchaseSoulName(
          soulname,
          registrationPeriod,
          paymentMethod,
          soulNameStyle
        );

        if (result) {
          onMintSuccess?.();
        }

        if (!result) onMintError?.();

        onRegisterFinish?.();

        return result;
      }

      const result = await purchaseIdentityWithSoulName(
        paymentMethod,
        soulname,
        registrationPeriod,
        soulNameStyle
      );

      if (result) {
        onMintSuccess?.();
      }

      if (!result) onMintError?.();

      onRegisterFinish?.();

      return result;
    } catch (error: unknown) {
      const errorObject = error as {
        code: string;
        message: string;
      };

      const subtitle =
        (errorMessages?.[errorObject.code] as string | undefined) ??
        ('Unknown error' as string);

      console.error(`Minting failed! ${errorObject.message}`);

      onMintError?.();

      return {
        title: '',
        subtitle,
      };
    }
  }, [
    onRegisterFinish,
    soulname,
    identity,
    paymentMethod,
    registrationPeriod,
    registrationPrice,
    soulNameError,
    purchaseIdentityWithSoulName,
    purchaseSoulName,
    soulNameStyle,
    onMintSuccess,
    onMintError,
    setShowError,
  ]);

  return {
    onRegisterSoulname,
    hasRegisteredSoulname,
    isRegisteringSoulname,
  };
};