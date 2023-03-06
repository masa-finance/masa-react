import React, { useEffect } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { Spinner } from '../../../spinner';

export const InterfaceConnected = (): JSX.Element => {
  const { closeModal, isLoading, isModalOpen } = useMasa();

  useEffect(() => {
    let timeout;
    if (isModalOpen && !isLoading) {
      timeout = setTimeout(() => {
        closeModal?.();
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, closeModal, isModalOpen]);

  if (isLoading) return <MasaLoading />;

  return (
    <div className="interface-connected">
      <div>
        <h3 className="title">Starting your soulbound journey</h3>

        <Spinner />
      </div>
    </div>
  );
};
