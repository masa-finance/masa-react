import React, { useEffect } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { Spinner } from '../../../spinner';

export const InterfaceConnected = (): JSX.Element => {
  const { loading, closeModal } = useMasa();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        closeModal?.();
      }, 3000);
    }
  }, [loading, closeModal]);

  if (loading) return <MasaLoading />;

  return (
    <div className="interface-connected">
      <div>
        <h3 className="title">Starting your soulbound journey</h3>

        <Spinner />
      </div>
    </div>
  );
};
