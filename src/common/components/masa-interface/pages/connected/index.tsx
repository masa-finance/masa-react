import React, { useEffect } from 'react';
import { useMasa } from '../../../../helpers/provider/use-masa';
import { MasaLoading } from '../../../masa-loading';
import { Spinner } from '../../../spinner';

export const InterfaceConnected = () => {
  const { company, loading, closeModal } = useMasa();

  useEffect(() => {
    setTimeout(() => {
      closeModal?.();
    }, 3000);
  }, []);

  if (loading) return <MasaLoading />;
  return (
    <div className="interface-connected">
      <div>
        <h3 className="title">We are taking you to {company}</h3>

        <Spinner />
      </div>
    </div>
  );
};
