import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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
  showError: boolean;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
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

  // * UI Inputs
  const [registrationPeriod, setRegistrationPeriod] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    paymentMethods[0]?.name
  );
  const [soulname, setSoulname] = useState<string>('');
  const [showError, setShowError] = useState(false);

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
    if (isLoadingAvailability || !masa) return undefined;
    if (!isAvailable) return 'Soulname not available';

    const { isValid, message } = masa.soulName.validate(soulname);

    if (!isValid) return message;

    return undefined;
  }, [masa, soulname, isAvailable, isLoadingAvailability]);

  const { value: registrationPrice, loading: isLoadingRegistrationPrice } =
    useAsync(async (): Promise<string | undefined> => {
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

  // * make sure we do not get an undefined currency
  useEffect(() => {
    if (paymentMethod === undefined && paymentMethods.length > 0) {
      setPaymentMethod(paymentMethods[0].name);
    }
  }, [paymentMethod, paymentMethods]);
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
      setRegistrationPeriod(Math.max(1, registrationPeriod + num));
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
        showError,
        setShowError,
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
      showError,
      setShowError,
    ]
  );
  return (
    <CreateSoulnameContext.Provider value={value}>
      {children}
    </CreateSoulnameContext.Provider>
  );
};

export const useCreateSoulnameModal = () => useContext(CreateSoulnameContext);
