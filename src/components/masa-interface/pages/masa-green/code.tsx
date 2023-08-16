import ReactCodeInput from '@acusti/react-code-input';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocalStorage, useMasa } from '../../../../provider';
import type { SubflowPage } from '../../interface-subflow';

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

export const CodeInterface: React.FunctionComponent<SubflowPage> = ({
  next,
  back,
  context,
}: SubflowPage) => {
  const { useModalSize } = useMasa();

  useModalSize?.({ width: 800, height: 400 });

  const phoneNumber = useMemo(() => context.phoneNumber, [context]);
  const codeRef = useRef(null);
  const [code, setCode] = useState<string>('');
  const [showCountDown, setShowCountDown] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const { masa, handleGenerateGreen } = useMasa();

  const isValid = true;

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { localStorageSet } = useLocalStorage();

  useEffect(() => {
    time > 0 && setTimeout(() => setTime(time - 1), 1000);
  }, [time]);

  useEffect(() => {
    if (phoneNumber.length === 0) {
      back();
    }
  }, [phoneNumber, back]);

  const resendCode = useCallback(async () => {
    setCode('');
    setShowCountDown(true);
    const result = await handleGenerateGreen?.(phoneNumber);

    if (result) {
      const attempts = result.data?.length;

      if (attempts === 0) {
        back();
      } else {
        setTime(getRetryTimeout(attempts));
      }
    }
  }, [phoneNumber, handleGenerateGreen, back]);

  const verify = useCallback(
    async (completedCode: string, phone: string) => {
      if (masa) {
        const verifyResponse = await masa.green.verify(phone, completedCode);

        if (verifyResponse?.status === 'approved') {
          localStorageSet(`${phone}`, JSON.stringify(verifyResponse));
          next();
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
      }
    },
    [masa, next, localStorageSet]
  );

  const inputStyle = {
    borderRadius: '4px',
    border: '1px solid',
    paddingLeft: '22px',
    margin: '6px',
    width: '60px',
    height: '60px',
    fontSize: '22px',
    color: 'black',
    backgroundColor: 'white',
    borderColor: 'lightgrey',
  };

  const invalidStyle = {
    borderRadius: '4px',
    border: '1px solid',
    paddingLeft: '22px',
    margin: '6px',
    width: '60px',
    height: '60px',
    fontSize: '22px',
    color: 'black',
    backgroundColor: 'white',
    borderColor: 'red',
  };

  const handleUpdateCode = useCallback(
    async (code: string) => {
      setCode(code);

      if (code.length === 6) {
        await verify(code, phoneNumber);
      }
    },
    [setCode, phoneNumber, verify]
  );

  return (
    <div className="code-input-interface">
      <div>
        <h2>Enter 2FA 6-digit code</h2>
        <h3>{`We sent a code to your phone number ending in ${phoneNumber?.slice(
          -4
        )}.`}</h3>
      </div>
      <div className="code-input">
        <ReactCodeInput
          ref={codeRef}
          value={code}
          onChange={handleUpdateCode}
          inputStyle={inputStyle}
          inputStyleInvalid={invalidStyle}
          name="green"
          type="number"
          inputMode="numeric"
          fields={6}
          isValid={isValid}
        />
      </div>
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
    </div>
  );
};
