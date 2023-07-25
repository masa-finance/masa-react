import React, { useEffect, useMemo } from 'react';
import { MasaLoading } from '../../masa-loading';
import { Spinner } from '../../spinner';
import { useSession } from '../../../../masa/use-session';
import { useConfig } from '../../../../base-provider';
import { useModal } from '@ebay/nice-modal-react';

export const InterfaceConnected = (): JSX.Element => {
  const { isLoadingSession: isLoading } = useSession();
  const modal = useModal();
  const { company } = useConfig();

  useEffect(() => {
    let timeout;
    if (modal.visible && !isLoading) {
      timeout = setTimeout(() => {
        modal.hide();
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, modal.visible]);

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
