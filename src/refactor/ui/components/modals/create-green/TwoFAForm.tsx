import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactCodeInput from '@acusti/react-code-input';
import { useModal } from '@ebay/nice-modal-react';

export const TwoFAForm = () => {
  const modal = useModal();

  const codeRef = useRef(null);
  const [code, setCode] = useState<string>('');
  const [showCountDown, setShowCountDown] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    time > 0 && setTimeout(() => setTime(time - 1), 1000);
  }, [time]);

  const handleUpdateCode = useCallback(
    async (code: string) => {
      setCode(code);

      if (code.length === 6) {
        modal.resolve();
        /* await verify(code, phoneNumber); */
      }
    },
    [setCode]
  );

  const resendCode = () => {
    setCode('');
    setShowCountDown(true);
  };

  return (
    <section>
      <ReactCodeInput
        className="code-input-interface code-input input invalid"
        ref={codeRef}
        name="green"
        value={code}
        onChange={handleUpdateCode}
        type="number"
        inputMode="numeric"
        fields={6}
      />
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
