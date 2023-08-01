import React, { useState, useEffect, useMemo } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useModal } from '@ebay/nice-modal-react';
import { useGreenGenerate } from '../../../../masa/use-green-create';

export const PhoneInputForm = ({ context }: any) => {
  const modal = useModal();
  const { handleGenerateGreen } = useGreenGenerate();

  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setContextPhoneNumber = useMemo(
    () => context.setPhoneNumber,
    [context]
  );

  useEffect(() => {
    if (isPhoneValid) {
      setContextPhoneNumber(phoneNumber);
    }
  }, [isPhoneValid, phoneNumber, setContextPhoneNumber]);

  const getCode = async () => {
    /* const result = await handleGenerateGreen?.(phoneNumber); */

    const result = {
      status: 'pending',
      message: 'success',
    };

    if (result) {
      if (result.status === 'pending') {
        modal.resolve();
      }

      if (result.status === '429') {
        setErrorMsg(
          'Too many requests. Please wait 24hrs before trying again.'
        );
      }

      if (result.status === 'failed') {
        setErrorMsg(result?.message ?? '');
      }
    } else {
      modal.reject(new Error('Rejected'));
    }
  };

  return (
    <div className="input-container">
      <div className="phone-input">
        <p className="phone-input-label">Phone Number*</p>
        <PhoneInput
          international
          defaultCountry="US"
          onChange={(value: string) => {
            if (value) {
              setIsPhoneValid(isValidPhoneNumber(value));
              setPhoneNumber(value);
            }
          }}
        />
      </div>
      <button
        className="masa-button"
        onClick={() => getCode()}
        disabled={!isPhoneValid}
      >
        Mint Masa Green SBT
      </button>
      {errorMsg && <p className="text-center text-red">{errorMsg}</p>}
    </div>
  );
};
