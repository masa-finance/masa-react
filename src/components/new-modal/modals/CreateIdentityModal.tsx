import React, { useCallback } from 'react';
import { useMasa } from '../../../provider';
import { MasaLoading } from '../../masa-loading';

export const CreateIdentityModal = (): JSX.Element => {
  const { handlePurchaseIdentity, isLoading, setForcedPage } = useMasa();

  const createIdentity = useCallback(async () => {
    const createIdentityRes = await handlePurchaseIdentity?.();

    if (createIdentityRes && setForcedPage) {
      setForcedPage('successIdentityCreate');
    }
  }, [handlePurchaseIdentity, setForcedPage]);

  if (isLoading) return <MasaLoading />;

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

export default CreateIdentityModal;
