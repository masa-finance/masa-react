import React, { useMemo } from 'react';
import { Input } from '../../Input';
import { Spinner } from '../../spinner';
import { Select } from '../../Select';
import { useCreateSoulnameModal } from './CreateSoulnameProvider';

const CreateSoulnameForm = () => {
  const {
    extension,
    paymentMethods,
    soulname,
    paymentMethod,
    handleChangeSoulname,
    isLoadingAvailability,
    isAvailable,
    registrationPeriod,
    updatePaymentMethod,
    registrationPrice,
    updatePeriod,
  } = useCreateSoulnameModal();

  const LoadingSoulnameAvailible = useMemo(() => {
    if (soulname !== '' && soulname.length > 0) {
      if (isLoadingAvailability) {
        return (
          <div className="available-indicator">
            <Spinner color="black" size={12} />
          </div>
        );
      }
      if (isAvailable) {
        return (
          <p className="available-indicator" style={{ color: '#728a74e6' }}>
            Available
          </p>
        );
      }
      return (
        <p className="available-indicator" style={{ color: '#964f4fe6' }}>
          Unavailable
        </p>
      );
    }
    return null;
  }, [soulname, isAvailable, isLoadingAvailability]);

  return (
    <section className="soulname-purchase-container">
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
        {LoadingSoulnameAvailible}
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
              <button type="button" onClick={() => updatePeriod(-1)}>
                -
              </button>
              <button type="button" onClick={() => updatePeriod(1)}>
                +
              </button>
            </div>
          </div>
          <Select
            label="Payment asset"
            values={paymentMethods}
            onChange={updatePaymentMethod}
            readOnly
          />
          <Input
            label="Registration price"
            value={`${
              registrationPrice ? registrationPrice.slice(0, 7) : '-.-'
            } ${paymentMethod}`}
            readOnly
          />
        </div>
      </div>
    </section>
  );
};

export default CreateSoulnameForm;
