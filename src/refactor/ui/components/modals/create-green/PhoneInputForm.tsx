import React, { useState, useEffect, useMemo } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useModal } from '@ebay/nice-modal-react';

export const PhoneInputForm = () => {
  const modal = useModal();

  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* const setContextPhoneNumber = useMemo(
   *   () => context.setPhoneNumber,
   *   [context]
   * );
   */
  /* useEffect(() => {
   *   if (isPhoneValid) {
   *     setContextPhoneNumber(phoneNumber);
   *   }
   * }, [isPhoneValid, phoneNumber, setContextPhoneNumber]);
   */
  const getCode = async () => {
    modal.resolve();
    /* const result = await handleGenerateGreen?.(phoneNumber); */
    /* if (result) {
       *   if (result.status === 'pending') {
       *     next();
       *   }

       *   if (result.status === '429') {
       *     setErrorMsg(
       *       'Too many requests. Please wait 24hrs before trying again.'
       *     );
       *   }

       *   if (result.status === 'failed') {
       *     setErrorMsg(result?.message ?? '');
       *   }
       * } else {
       *   setIndex('error');
       * } */
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
      <button className="masa-button" onClick={() => getCode()}>
        Mint Masa Green SBT
      </button>
      {errorMsg && <p className="text-center text-red">{errorMsg}</p>}
    </div>
  );
};
