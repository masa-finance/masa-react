import React, { useCallback, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useMasaClient } from '../../../../masa-client/use-masa-client';
import { useDebounce } from '../../../../hooks/use-debounce';

export const useSoulnameModal = () => {
  const { masa } = useMasaClient();

  const { value: enabledMethods, loading: isLoadingEnabledMethods } =
    useAsync(async () => {
      const methods =
        await masa?.contracts.instances.SoulStoreContract.getEnabledPaymentMethods();
      return methods;
    }, [masa]);

  const { value: extension, loading: isLoadingExtension } =
    useAsync(async () => {
      const ext = await masa?.contracts.instances.SoulNameContract.extension();
      return ext;
    }, [masa]);

  const paymentMethods = useMemo(() => {
    const tokensAvailable = {
      ...masa?.config.network?.addresses.tokens,
    };

    const values: { name: PaymentMethod; value: string }[] = [];
    values.push({
      name: masa?.config.network?.nativeCurrency?.name as PaymentMethod,
      value: masa?.config.network?.nativeCurrency?.name as string,
    });

    for (const token in tokensAvailable) {
      if (
        tokensAvailable[token] &&
        enabledMethods &&
        enabledMethods.includes(tokensAvailable[token] as string)
      )
        values.push({
          name: token as PaymentMethod,
          value: tokensAvailable[token] as string,
        });
    }

    return values;
  }, [masa, enabledMethods]);

  return {
    enabledMethods,
    paymentMethods,
    extension,

    isLoadingEnabledMethods,
    isLoadingExtension,
  };
};

export const useSoulnameInterface = () => {
  const { paymentMethods } = useSoulnameModal();
  const { masa } = useMasaClient();

  // * UI Inputs
  const [registrationPeriod, setRegistrationPeriod] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    paymentMethods[0]?.name
  );
  const [soulname, setSoulname] = useState<string>('');

  const debounceSearch = useDebounce(soulname, 1000);
  const { value: isAvailable, loading: isLoadingAvailability } =
    useAsync(async () => {
      if (masa && debounceSearch) {
        const isAv = await masa.contracts.soulName.isAvailable(
          debounceSearch as string
        );
        return isAv;
      }

      return false;
    }, [masa, debounceSearch]);

  const soulNameError = useMemo((): string | undefined => {
    if (masa) {
      const { isValid, message } = masa.soulName.validate(soulname);

      if (!isValid) {
        return message;
      }
    }

    if (!isAvailable) {
      return 'Soulname not available';
    }

    return undefined;
  }, [masa, soulname, isAvailable]);

  const { value: registrationPrice, loading: isLoadingRegistrationPrice } =
    useAsync(async () => {
      let formattedPrice: string | undefined;

      if (masa && debounceSearch) {
        const { length } = masa.soulName.validate(debounceSearch as string);

        try {
          const formattedPriceResult = await masa.contracts.soulName.getPrice(
            paymentMethod,
            length,
            registrationPeriod
          );
          formattedPrice = formattedPriceResult.formattedPrice;
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(error.message);
          }
        }
      }

      return formattedPrice;
    }, [masa, debounceSearch, paymentMethod, registrationPeriod]);

  // * onChange handlers
  const updatePaymentMethod = useCallback((e: unknown) => {
    const event = e as { target: { value: PaymentMethod } };
    setPaymentMethod(event.target?.value);
  }, []);

  const handleChangeSoulname = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSoulname(event.target.value);
    },
    [setSoulname]
  );

  const updatePeriod = useCallback(
    (num: number) => {
      setRegistrationPeriod(registrationPeriod + num);
    },
    [registrationPeriod, setRegistrationPeriod]
  );

  return {
    soulname,
    setSoulname,
    soulNameError,
    registrationPeriod,

    isAvailable,
    isLoadingAvailability,
    registrationPrice,
    isLoadingRegistrationPrice,

    paymentMethod,
    updatePaymentMethod,
    handleChangeSoulname,
    updatePeriod,
  };
};
