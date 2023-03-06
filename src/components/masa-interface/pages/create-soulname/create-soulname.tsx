import { Input } from '../../../input';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce, useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { PaymentMethod } from '@masa-finance/masa-sdk';
import { Spinner } from '../../../spinner';

export const InterfaceCreateSoulname = (): JSX.Element => {
  const {
    handlePurchaseIdentityWithSoulname,
    isLoading,
    identity,
    closeModal,
    masa,
  } = useMasa();

  const [soulname, setSoulname] = useState<string>('');
  const [extension, setExtension] = useState<string>();
  const [loadingIsAvailable, setLoadingIsAvailable] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [registrationPeriod, setRegistrationPeriod] = useState<number>(1);
  const [registrationPrice, setRegistrationPrice] = useState<string>('0');
  const [paymentMethod] = useState<PaymentMethod>('eth');
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

  useEffect(() => {
    const updatePrice = async () => {
      if (masa && debounceSearch) {
        const { length } = masa.soulName.validate(debounceSearch as string);
        const { formattedPrice } = await masa.contracts.soulName.getPrice(
          paymentMethod,
          length,
          registrationPeriod
        );

        setRegistrationPrice(formattedPrice);
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
      // do we have an identity yet?
      identity?.identityId
        ? // yes, only mint soul name
          await masa?.soulName.create?.('eth', soulname, registrationPeriod)
        : // nope, mint both
          await handlePurchaseIdentityWithSoulname?.(
            'eth',
            soulname,
            registrationPeriod
          );

      closeModal?.(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Minting failed! ${error.message}`);
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
  ]);

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

  return (
    <div className="interface-create-soulname">
      <div className="title-container">
        <h3 className="title">
          Register a <span>{extension}</span> name
        </h3>
        <p className="subtitle">
          Claim your <b>{extension}</b> domain name. 5+ character domains are{' '}
          <b>FREE,</b> only pay the gas fee.
        </p>
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
            <p
              className="available-indicator"
              style={{ color: isAvailable ? '#728a74e6' : '#964f4fe6' }}
            >
              {loadingIsAvailable ? (
                <Spinner color="black" size={12} />
              ) : isAvailable ? (
                'Available'
              ) : (
                'Unavailable'
              )}
            </p>
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
            <Input label="Payment asset" value="Celo" />
            <Input
              label="Registration price"
              value={`${registrationPrice.substring(0, 7)} Celo`}
            />
          </div>
        </div>

        {/* <div style={{ width: '100%' }}>
          <Input label="Registration price to pay" />
          <p className="price-estimation">Estimated total (Price + Gas)</p>
        </div> */}
      </div>

      <div style={{ width: '100%' }}>
        <button
          className="masa-button"
          onClick={soulNameError ? () => setShowError(true) : handleMinting}
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
