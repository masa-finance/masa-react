import React, { useState, useEffect } from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { useLocalStorage } from '../../../../../provider';
import { MasaLoading } from '../../masa-loading';

export const VerifyMintModal = () => {
  const modal = useModal();
  const { localStorageGet, localStorageSet } = useLocalStorage();
  const [execute, setHasToExecute] = useState(false);
  /*
   *   useEffect(() => {
   *     const startVerification = async () => {
   *       if (execute && typeof phone === 'string') {
   *         const verificationData = localStorageGet(`${phone}`) as string;
   *
   *         if (verificationData) {
   *           const verificationObject = JSON.parse(verificationData);
   *
   *           if (verificationObject.status === 'approved') {
   *             const { authorityAddress, signature, signatureDate } =
   *               verificationObject;
   *
   *             try {
   *               const mintResponse = await masa?.green.mint(
   *                 'ETH',
   *                 authorityAddress,
   *                 signatureDate,
   *                 signature
   *               );
   *
   *               localStorageSet(`${phone}`, '0');
   *
   *               if (mintResponse?.tokenId) {
   *                 const referralCode = localStorage.getItem('referralCode') as
   *                   | string
   *                   | undefined;
   *
   *                 if (
   *                   referralCode &&
   *                   typeof window !== 'undefined' &&
   *                   window?.RF !== undefined
   *                 ) {
   *                   const rf_code = JSON.parse(referralCode);
   *
   *                   // send qualification to referral factory
   *                   window.RF.qualify({
   *                     code: rf_code,
   *                   });
   *
   *                   localStorage.removeItem('referralCode');
   *                 }
   *
   *                 modal.resolve();
   *               }
   *             } catch {
   *               localStorageSet(`${phone}`, '0');
   *               setIndex('error');
   *             }
   *           }
   *         }
   *       }
   *     };
   *     void startVerification();
   *   }, []);
   *
   *   useEffect(() => {
   *     setHasToExecute(true);
   *   }, []);
   *  */
  return (
    <section className="verify-mint-interface">
      <h2>
        Phone number is verified!
        <br />
        Now mint your Masa Green SBT
      </h2>

      <div>
        <MasaLoading />
      </div>

      <div className="w-full flex justify-center mt-12">
        <p className="w-3/5 leading-relaxed text-lightBlack text-center">
          If you <span className="emphasize">cancel</span> your SBT mint or if
          the <span className="emphasize"> transaction fails</span> you will
          have to verify your number again.
        </p>

        <button onClick={() => modal.resolve()}>Resolve</button>
      </div>
    </section>
  );
};
