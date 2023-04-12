import { useLocalStorage, useMasa } from '../../../../provider';
import { SubflowPage } from 'components/masa-interface/interface-subflow';
import React, { useEffect, useMemo, useState } from 'react';
import { MasaLoading } from '../../../../components/masa-loading';

export const VerifyAndMintInterface: React.FunctionComponent<SubflowPage> = ({
  next,
  context,
  setIndex,
}: SubflowPage) => {
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

                const referralCode = localStorage.getItem("referralCode") as
                | string
                | undefined;
      
              if (
                referralCode &&
                typeof window !== "undefined" &&
                typeof window?.RF !== "undefined"
              ) {
                const rf_code = JSON.parse(referralCode);
      
                // send qualification to referral factory
                window.RF.qualify({
                  code: rf_code,
                });
      
                localStorage.removeItem("referralCode");
              }

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
  }, [
    excecute,
    phone,
    masa?.green,
    next,
    localStorageGet,
    localStorageSet,
    setIndex,
  ]);

  useEffect(() => {
    setHasToExecute(true);
  }, []);

  return (
    <div className="verify-mint-interface">
      <h2>
        Phone number is verified!
        <br />
        Now mint your Masa Green SBT
      </h2>

      <MasaLoading />

      <div className="w-full flex justify-center mt-12">
        <p className="w-3/5 leading-relaxed text-lightBlack text-center">
          If you <span className={'emphasize'}>cancel</span> your SBT mint or if
          the <span className={'emphasize'}> transaction fails</span> you will
          have to verify your number again.
        </p>
      </div>
    </div>
  );
};
