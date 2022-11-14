import React, { useMemo } from 'react';
import { useMasa } from '../../helpers/provider/use-masa';
import { ModalComponent } from '../modal';
import { InterfaceAuthenticate } from './pages/authenticate';
import { InterfaceConnected } from './pages/connected';
import { InterfaceConnector } from './pages/connector';
import { InterfaceCreateIdentity } from './pages/createIdentity';

const pages = {
  connector: <InterfaceConnector />,
  createIdentity: <InterfaceCreateIdentity />,
  connectedState: <InterfaceConnected />,
  authenticate: <InterfaceAuthenticate />,
};

export const MasaInterface = () => {
  const {
    isModalOpen,
    setModalOpen,
    isConnected,
    loading,
    identity,
    loggedIn,
    closeModal,
    scope,
  } = useMasa();

  const page = useMemo(() => {
    console.log({ loading, isConnected, identity, loggedIn });

    switch (true) {
      case !isConnected:
        return 'connector';

      case !loggedIn:
        return 'authenticate';

      // @ts-ignore
      case !identity:
        if (scope?.includes('identity')) return 'createIdentity';
        // todo this cant be correct, but otherwise i will get a typescript error
        return '';

      case isConnected && loggedIn:
        return 'connectedState';

      default:
        return 'connector';
    }
  }, [loading, isConnected, identity, loggedIn, scope]);

  return (
    <>
      <ModalComponent
        open={isModalOpen as boolean}
        close={() => closeModal?.()}
        setOpen={setModalOpen as (val: boolean) => void}
      >
        {pages[page]}
      </ModalComponent>
    </>
  );
};
