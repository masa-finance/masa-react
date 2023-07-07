import React, { useEffect, useMemo } from 'react';
import { useMasa } from '../../../../../provider';
import { MasaLoading } from '../../masa-loading';
import { Spinner } from '../../spinner';
import { useSession } from '../../../../masa/use-session';

export const InterfaceConnected = (): JSX.Element => {
  const { closeModal, company, isModalOpen } = useMasa();
  const { isLoadingSession: isLoading } = useSession();

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

  const titleText = useMemo(() => {
    switch (company) {
      case 'Masa': {
        return 'Starting your soulbound journey';
      }
      case 'Celo': {
        return 'Launching your Prosperity Passport';
      }
      case 'Base': {
        return 'Taking you to Base Camp';
      }
      default: {
        return 'Starting your soulbound journey';
      }
    }
  }, [company]);

  if (isLoading) return <MasaLoading />;

  return (
    <section className="interface-connected">
      <section>
        <h3 className="title">{titleText}</h3>
        <Spinner />
      </section>
    </section>
  );
};
