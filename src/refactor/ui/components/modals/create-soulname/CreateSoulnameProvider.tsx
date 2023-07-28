import React, {
  ReactNode,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useAsync } from 'react-use';
import type { PaymentMethod } from '@masa-finance/masa-sdk';
import { useMasaClient } from '../../../../masa-client/use-masa-client';
import { useDebounce } from '../../../../hooks/use-debounce';

export interface CreateSoulnameProviderValue {
  enabledMethods?: string[];
  paymentMethods?: {
    name: PaymentMethod;
    value: string;
  }[];
  extension?: string;

  isLoadingEnabledMethods: boolean;
  isLoadingExtension: boolean;

  soulname: string;
  setSoulname: React.Dispatch<React.SetStateAction<string>>;
  soulNameError?: string;
  registrationPeriod: number;

  isAvailable?: boolean;
  isLoadingAvailability: boolean;
  registrationPrice?: string;
  isLoadingRegistrationPrice: boolean;

  paymentMethod: PaymentMethod;
  updatePaymentMethod: (e: unknown) => void;
  handleChangeSoulname: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updatePeriod: (num: number) => void;
}

export const CreateSoulnameContext = createContext(
  {} as CreateSoulnameProviderValue
);
export const CreateSoulnameProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // * sdk derivatives
  const { sdk: masa } = useMasaClient();

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
      if (masa && debounceSearch) {
        const { length } = masa.soulName.validate(debounceSearch as string);

        let formattedPrice = '';

        try {
          const formattedPriceResult = await masa.contracts.soulName.getPrice(
            paymentMethod,
            length,
            registrationPeriod
          );
          formattedPrice = formattedPriceResult.formattedPrice;
          return formattedPrice;
        } catch (error) {
          console.log(error);
          return '';
        }
      }

      return '';
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

  const value = useMemo(
    () =>
      ({
        enabledMethods,
        paymentMethods,
        extension,

        isLoadingEnabledMethods,
        isLoadingExtension,

        // * UI Inputs
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
      }) as CreateSoulnameProviderValue,
    [
      enabledMethods,
      paymentMethods,
      extension,
      isLoadingEnabledMethods,
      isLoadingExtension,
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
    ]
  );
  return (
    <CreateSoulnameContext.Provider value={value}>
      {children}
    </CreateSoulnameContext.Provider>
  );
};

export const useCreateSoulnameModal = () => useContext(CreateSoulnameContext);
