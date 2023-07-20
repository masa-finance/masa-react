import { Input } from '../../../input';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce, useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { PaymentMethod } from '@masa-finance/masa-sdk';
import { Spinner } from '../../../spinner';
import { Select } from '../../../select';
import { InterfaceErrorModal } from '../error-modal';

const errorMessages = {
  UNPREDICTABLE_GAS_LIMIT:
    'You do not have sufficient funds in you wallet. Please add funds to your wallet and try again',
  ACTION_REJECTED: 'Transaction rejected by the user.',
};

export const InterfaceCreateSoulname = (): JSX.Element => {
  const {
    handlePurchaseIdentityWithSoulname,
    isLoading,
    identity,
    closeModal,
    company,
    masa,
    forcedPage,
    setForcedPage,
    reloadSoulnames,
    soulNameStyle,
  } = useMasa();
  const [enabledMethods, setEnabledMethods] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const enabledMethodsres =
        await masa?.contracts.instances.SoulStoreContract.getEnabledPaymentMethods();

      setEnabledMethods(enabledMethodsres as string[]);
    })();
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
        enabledMethods.includes(tokensAvailable[token])
      )
        values.push({
          name: token as PaymentMethod,
          value: tokensAvailable[token],
        });
    }

    return values;
  }, [masa, enabledMethods]);

  const [error, setError] = useState<null | {
    title: string;
    subtitle: string;
  }>(null);
  const [soulname, setSoulname] = useState<string>('');
  const [extension, setExtension] = useState<string>();
  const [loadingIsAvailable, setLoadingIsAvailable] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [registrationPeriod, setRegistrationPeriod] = useState<number>(1);
  const [registrationPrice, setRegistrationPrice] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    paymentMethods[0]?.name
  );
  const [isLoadingMint, setLoadingMint] = useState(false);
  const [showError, setShowError] = useState(false);

  const debounceSearch = useDebounce(soulname, 1000);

  useEffect(() => {
    const loadExtension = async () => {
      setExtension(
        await masa?.contracts.instances.SoulNameContract.extension()
      );
    };

    void loadExtension();
  }, [masa]);

  useEffect(() => {
    const checkIsAvailable = async () => {
      if (masa && debounceSearch) {
        setLoadingIsAvailable(true);
        setIsAvailable(
          await masa.contracts.soulName.isAvailable(debounceSearch as string)
        );
        setLoadingIsAvailable(false);
      }
    };

    void checkIsAvailable();
  }, [masa, debounceSearch, setLoadingIsAvailable, setIsAvailable]);

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

  const handleErrorConfirmed = () => setError(null);

  useEffect(() => {
    const updatePrice = async () => {
      if (masa && debounceSearch) {
        const { length } = masa.soulName.validate(debounceSearch as string);

        let formattedPrice;
        try {
          formattedPrice = (
            await masa.contracts.soulName.getPrice(
              paymentMethod,
              length,
              registrationPeriod
            )
          ).formattedPrice;
        } finally {
          setRegistrationPrice(formattedPrice);
        }
      }
    };

    void updatePrice();
  }, [masa, debounceSearch, paymentMethod, registrationPeriod]);

  const handleChangeSoulname = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSoulname(event.target.value);
    },
    [setSoulname]
  );

  const updatePeriod = (num: number) => {
    setRegistrationPeriod(registrationPeriod + num);
  };

  const handleMinting = useCallback(async () => {
    setLoadingMint(true);

    try {
      if (identity && identity.identityId) {
        await masa?.soulName.create(
          paymentMethod,
          soulname,
          registrationPeriod,
          undefined,
          soulNameStyle
        );
      } else {
        await handlePurchaseIdentityWithSoulname?.(
          paymentMethod,
          soulname,
          registrationPeriod,
          soulNameStyle
        );
      }

      if (setForcedPage) {
        reloadSoulnames?.();
        setForcedPage('successIdentityCreate');
      } else {
        closeModal?.(true);
      }
    } catch (error: unknown) {
      if (error) {
        console.log({ error });
        const errorObject = error as {
          code: string;
          message: string;
        };
        setError({
          title: '',
          subtitle: errorMessages?.[errorObject.code] ?? 'Unknown error',
        });
        console.error(`Minting failed! ${errorObject.message}`);
      }
    }
    setLoadingMint(false);
  }, [
    masa,
    soulname,
    registrationPeriod,
    handlePurchaseIdentityWithSoulname,
    identity,
    closeModal,
    paymentMethod,
    forcedPage,
    setForcedPage,
    reloadSoulnames,
  ]);

  const updatePaymentMethod = (e: unknown) => {
    const event = e as { target: { value: PaymentMethod } };
    setPaymentMethod(event.target?.value);
  };

  const createSoulnameTitle = useMemo(() => {
    switch (company) {
      case 'Brozo':
      case 'Base Universe':
        return `Register a ${company} ${extension} Name`;
      default:
        return `Register a ${extension} Name`;
    }
  }, [company, extension]);

  const createSoulnameSubtitle = useMemo(() => {
    switch (company) {
      case 'Base Universe':
        return (
          <>
            Claim your <b>{extension}</b> domain name before it&apos;s taken!
            Domains are <b>FREE on testnet,</b> only pay the gas to mint.
          </>
        );
      case 'Brozo':
        return (
          <>
            Claim your rare <b>{extension}</b> domain name before it’s taken!
          </>
        );
      default:
        return (
          <>
            Claim your <b>{extension}</b> domain name. 5+ character domains are{' '}
            <b>FREE,</b> only pay the gas fee.
          </>
        );
    }
  }, [company, extension]);

  if (isLoading) return <MasaLoading />;

  if (isLoadingMint)
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <h1 className="title">Minting your domain</h1>
          <h1 className="title">
            {soulname}
            <b>{extension}</b>
          </h1>
          <MasaLoading />
        </div>
      </div>
    );

  if (error) {
    return (
      <InterfaceErrorModal
        {...error}
        handleComplete={handleErrorConfirmed}
        buttonText={'Try again'}
      />
    );
  }

  return (
    <div className="interface-create-soulname">
      <div className="title-container">
        <h3 className="title">{createSoulnameTitle}</h3>
        <p className="subtitle">{createSoulnameSubtitle}</p>
      </div>

      <div className="soulname-purchase-container">
        <div
          style={{
            width: '100%',
            marginBottom: 24,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Input
            label="Domain name"
            required
            onChange={handleChangeSoulname}
            className="transparent"
          />

          <p className="soulname-input-overlay">
            {soulname ? (
              <>
                {soulname}
                <b>{extension}</b>
              </>
            ) : (
              <>
                domain
                <b>{extension}</b>
              </>
            )}
          </p>
          {soulname !== '' && soulname.length >= 1 ? (
            <>
              {loadingIsAvailable ? (
                <div className="available-indicator">
                  <Spinner color="black" size={12} />
                </div>
              ) : isAvailable ? (
                <p
                  className="available-indicator"
                  style={{ color: '#728a74e6' }}
                >
                  Available
                </p>
              ) : (
                <p
                  className="available-indicator"
                  style={{ color: '#964f4fe6' }}
                >
                  Unavailable
                </p>
              )}
            </>
          ) : null}
        </div>

        <div style={{ width: '100%' }}>
          <div className="soulname-purchase-details-container">
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Input
                label="Registration period"
                style={{
                  textAlign: 'center',
                  color: 'color: rgba(0, 0, 0, 0.4)',
                }}
                value={`${registrationPeriod} year${
                  registrationPeriod > 1 ? 's' : ''
                }`}
                disabled
              />
              <div className="period-buttons">
                <button onClick={() => updatePeriod(-1)}>-</button>
                <button onClick={() => updatePeriod(1)}>+</button>
              </div>
            </div>
            <Select
              label="Payment asset"
              values={paymentMethods}
              onChange={updatePaymentMethod}
              readOnly={true}
            />
            <Input
              label="Registration price"
              value={`${
                registrationPrice ? registrationPrice.substring(0, 7) : '-.-'
              } ${paymentMethod}`}
              readOnly={true}
            />
          </div>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <button
          id="gtm_register_domain"
          className="masa-button"
          onClick={
            soulNameError || !registrationPrice
              ? () => setShowError(true)
              : handleMinting
          }
        >
          Register your domain
        </button>
        {showError && soulNameError && (
          <p style={{ color: 'red', width: '100%', textAlign: 'center' }}>
            {soulNameError}
          </p>
        )}
      </div>
    </div>
  );
};
