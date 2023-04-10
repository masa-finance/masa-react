import { SubflowPage } from '../../interface-subflow';
import React, { useEffect, useMemo, useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import Reaptcha from 'reaptcha';
import { useMasa } from '../../../../provider';
import 'react-phone-number-input/style.css';

export const PhoneInputInterface: React.FunctionComponent<SubflowPage> = ({
  next,
  context,
  setIndex,
}: SubflowPage) => {
  const { handleGenerateGreen } = useMasa();

  const { useModalSize } = useMasa();

  useModalSize?.({ width: 800, height: 600 });

  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recaptchaVerified, setRecaptchaVerified] = useState<boolean>(false);

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
    const result = await handleGenerateGreen?.(phoneNumber);
    if (result) {
      if (result['status'] === 'pending') {
        next();
      }

      if (result['status'] === '429') {
        setErrorMsg(
          'Too many requests. Please wait 24hrs before trying again.'
        );
      }

      if (result['status'] === 'failed') {
        setErrorMsg(result?.message ?? '');
      }
    } else {
      setIndex('error');
    }
  };

  const onRecaptchaVerify = () => {
    setRecaptchaVerified(true);
  };

  return (
    <div className="phone-input-interface">
      <h2>Complete 2FA</h2>

      <p className="phone-input-guide">
        Please enter your phone number to qualify for rewards.
        <br />
        You have two chances to verify your phone number. Your
        <br />
        account will be locked for 24 hours after two failed
        <br />
        verification attempts.
      </p>

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
      <Reaptcha
        className="g-recaptcha"
        sitekey={'6Lf623YkAAAAALcfUuQnr0NVdUwffckx_OQdfJs6'}
        onVerify={onRecaptchaVerify}
      />
      <button
        className={'masa-button'}
        onClick={() => getCode()}
        disabled={!isPhoneValid || !recaptchaVerified}
      >
        Mint Masa Green SBT
      </button>
      {errorMsg && <p className={'text-center text-red'}>{errorMsg}</p>}
    </div>
  );
};
