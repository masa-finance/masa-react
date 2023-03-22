import React, { useCallback } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceSuccessCreateIdentity = (): JSX.Element => {
  const { isLoading, setForcedPage } = useMasa();

  const handleComplete = useCallback(() => {
    setForcedPage?.(null);
  }, [setForcedPage]);

  if (isLoading) return <MasaLoading />;

  return (
    <div className="interface-create-identity">
      <h3 className="title">Hurray! 🎉</h3>
      <p className="subtitle">
        You have claimed your .celo domain and your Prosperity Passport has been
        minted.
      </p>
      <p>
        <span>twitter logo</span>Tweet your .celo domain
      </p>
      <button className="masa-button" onClick={handleComplete}>
        Go to dashboard
      </button>
    </div>
  );
};
