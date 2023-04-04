import { useLocalStorage, useMasa } from '../../../../provider';
import { SubflowPage } from 'components/masa-interface/interface-subflow';
import React, { useEffect, useMemo, useState } from 'react';

const emphasize = 'underline underline-offset-4 font-semibold';

export const VerifyAndMintInterface: React.FunctionComponent<SubflowPage> = ({
  next,
  context,
  setIndex,
}) => {
  const { masa } = useMasa();
  const { localStorageGet, localStorageSet } = useLocalStorage();
  const [excecute, setHasToExecute] = useState(false);

  const phone = useMemo(() => context.phoneNumber, [context]);

  useEffect(() => {
    const startVerification = async () => {
      if (excecute && typeof phone === 'string') {
        const verificationData = localStorageGet(`${phone}`) as
          | string
          | undefined;

        if (verificationData) {
          console.log({ verificationData });

          const verificationObject = JSON.parse(verificationData);

          if (verificationObject.status === 'approved') {
            const { authorityAddress, signature, signatureDate } =
              verificationObject;

            try {
              const mintResponse = await masa?.green.mint(
                'ETH',
                authorityAddress,
                signatureDate,
                signature
              );

              localStorageSet(`${phone}`, '0');

              if (mintResponse?.tokenId) {
                // const referralCode = localStorageGet('referralCode') as string | undefined;

                // if (
                //   referralCode &&
                //   typeof window !== 'undefined' &&
                //   typeof window?.RF !== 'undefined'
                // ) {
                //   const rf_code = JSON.parse(referralCode).value;

                //   window.RF.qualify({
                //     code: JSON.parse(rf_code),
                //   });

                //   remove('referralCode');
                // }

                setIndex('success');
              }
            } catch (e) {
              localStorageSet(`${phone}`, '0');
              setIndex('error');
            }
          }
        }
      }
    };

    void startVerification();
  }, [excecute, phone, masa?.green, next, localStorageGet, localStorageSet]);

  useEffect(() => {
    setHasToExecute(true);
  }, []);

  return (
    <div>
      <div className="mb-12">
        You phone number is verified!
        <br />
        Now mint your Masa Green SBT
      </div>

      <div className="w-full flex justify-center mt-12">
        <div className="w-3/5 leading-relaxed text-lightBlack text-center">
          If you <span className={emphasize}>cancel</span> your transaction or
          if the <br />
          <span className={emphasize}>transaction fails</span> you will have to
          verify your <br />
          number again.
        </div>
      </div>
    </div>
  );
};
