import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactCodeInput from '@acusti/react-code-input';
import { useModal } from '@ebay/nice-modal-react';
import { useCreateGreenModal } from './CreateGreenProvider';
import { useLocalStorage } from '../../../../../provider';

const errorMsgs = {
  expired: 'The code is expired. Please click Resend and try again!',
  maxAttempts: 'Max attempts reached. Please try again in 10 minutes',
  invalid: 'This code is not valid, please click Resend below and try again',
  unexpedted: `We're sorry, an unexpected error has occured`,
};

const getRetryTimeout = (attemptNumber?: number): number => {
  let result = 120;

  const retryTimeouts: { [key: number]: number } = {
    1: 15,
    2: 30,
    3: 40,
    4: 60,
    5: 90,
  };

  if (attemptNumber) {
    result = retryTimeouts[attemptNumber];
  }

  return result;
};

export const TwoFAForm = () => {
  const modal = useModal();
  const { phoneNumberContext } = useCreateGreenModal();

  const codeRef = useRef(null);
  const [code, setCode] = useState<string>('');
  const [showCountDown, setShowCountDown] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);

  const isValid = true;

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { localStorageSet } = useLocalStorage();

  useEffect(() => {
    time > 0 && setTimeout(() => setTime(time - 1), 1000);
  }, [time]);

  const handleUpdateCode = useCallback(
    async (code: string) => {
      setCode(code);

      if (code.length === 6) {
        await verify(code, phoneNumberContext);
      }
    },
    [setCode]
  );

  const resendCode = () => {
    setCode('');
    setShowCountDown(true);
  };

  const verify = useCallback(
    async (completedCode: string, phone: string) => {
      /* const verifyResponse = await masa.green.verify(phone, completedCode); */
      const verifyResponse = { status: 'approved', message: 'success' };

      if (verifyResponse?.status === 'approved') {
        localStorageSet(`${phone}`, JSON.stringify(verifyResponse));
        modal.resolve();
      } else {
        switch (verifyResponse?.status) {
          case 'pending': {
            setErrorMsg(errorMsgs.invalid);
            break;
          }
          case '404': {
            setErrorMsg(errorMsgs.expired);
            break;
          }
          case '429': {
            setErrorMsg(errorMsgs.maxAttempts);
            break;
          }
          default: {
            setErrorMsg(errorMsgs.unexpedted);
          }
        }
      }
    },
    [localStorageSet]
  );

  return (
    <section>
      <ReactCodeInput
        className="code-input input invalid"
        ref={codeRef}
        name="green"
        value={code}
        onChange={handleUpdateCode}
        type="number"
        inputMode="numeric"
        fields={6}
        isValid={isValid}
      />
      <p className="">{errorMsg}</p>
      <div className="">
        <p className="">
          Didn&apos;t get the code?{' '}
          {showCountDown && time !== 0 ? (
            <span className="font-bold ml-2">{time}</span>
          ) : (
            <span className="resend" onClick={() => resendCode()}>
              Resend
            </span>
          )}
        </p>
      </div>
    </section>
  );
};
