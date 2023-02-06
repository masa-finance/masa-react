import React, { useCallback } from 'react';
import { useMasa } from '../../../../helpers';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceCreateIdentity = (): JSX.Element => {
  const { handlePurchaseIdentity, handleLogout, loading } = useMasa();

  const createIdentity = useCallback(async () => {
    await handlePurchaseIdentity?.();
  }, [handlePurchaseIdentity]);

  if (loading) return <MasaLoading />;

  return (
    <div className="interface-create-identity">
      <div>
        <h3>It looks like you don't have an identity</h3>
        <p>Create your identity to enable all its benefits</p>
      </div>

      <div>
        <button className="masa-button" onClick={createIdentity}>
          Create your identity!
        </button>
        <div className="dont-have-a-wallet" onClick={() => handleLogout?.()}>
          <p>I don't want to create an identity</p>
        </div>
      </div>
    </div>
  );
};
