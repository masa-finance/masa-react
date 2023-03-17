import React, { useCallback, useState } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceCreateCreditScore = (): JSX.Element => {
  const { handleCreateCreditScore, isLoading } = useMasa();
  const [error, setError] = useState<string | null>(null);

  const createCreditScore = useCallback(async () => {
    setError(null);
    const minted: boolean | undefined = await handleCreateCreditScore?.();

    if (!minted)
      setError('There is not enough data for generating a credit report');
  }, [handleCreateCreditScore]);

  if (isLoading) return <MasaLoading />;

  return (
    <div className="interface-create-identity">
      <div>
        <h3>Your identity does not have a credit report</h3>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <p>Generate your credit report!</p>
        )}
      </div>
      <div>
        <button className="masa-button" onClick={createCreditScore}>
          Create now!
        </button>
        <div className="dont-have-a-wallet">
          <p>I don't want to use this wallet</p>
        </div>
      </div>
    </div>
  );
};
