import React, { useCallback, useState } from 'react';
import { useMasa } from '../../../../helpers/provider/use-masa';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceCreateCreditReport = () => {
  const { handleCreateCreditReport, loading } = useMasa();
  const [error, setError] = useState<string | null>(null);

  const createCreditReport = useCallback(async () => {
    setError(null);
    const minted = await handleCreateCreditReport?.();

    if (!minted)
      setError('There is not enough data for generating a credit report');
  }, [handleCreateCreditReport]);

  if (loading) return <MasaLoading />;

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
        <button className="masa-button" onClick={createCreditReport}>
          Create now!
        </button>
        <div className="dont-have-a-wallet">
          <a>
            <p>I don't want to use this wallet</p>
          </a>
        </div>
      </div>
    </div>
  );
};
