import React, { useCallback } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceCreateIdentity = (): JSX.Element => {
  const { handlePurchaseIdentity, isLoading } = useMasa();

  const createIdentity = useCallback(async () => {
    await handlePurchaseIdentity?.();
  }, [handlePurchaseIdentity]);

  if (isLoading) return <MasaLoading/>;

  return (
    <div className="interface-create-identity">
      <h3 className="title">Hurray! 🎉</h3>
      <p className="subtitle">
        Congratulations you already have a Celo Domain Name in your wallet. You
        must now mint a Celo Prosperity Passport.
      </p>
      <button className="masa-button" onClick={createIdentity}>
        Get Prosperity Passport
      </button>
    </div>
  );
};
