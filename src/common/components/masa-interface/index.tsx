import React, { useEffect, useMemo, useState } from 'react';
import { useMasa, useMetamask } from '../../helpers/provider/masa-provider';
import { MasaLoading } from '../masa-loading';
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
  } = useMasa();

  const page = useMemo(() => {
    console.log({ loading, isConnected, identity, loggedIn });
    switch (true) {
      case !isConnected:
        return 'connector';

      case !loggedIn:
        return 'authenticate';

      case !identity:
        return 'createIdentity';

      case !!identity:
        return 'connectedState';

      default:
        return 'connector';
    }
  }, [loading, isConnected, identity, loggedIn, isModalOpen]);

  console.log(page);

  console.log({ isConnected });

  return (
    <>
      <ModalComponent
        open={isModalOpen as boolean}
        close={closeModal}
        setOpen={setModalOpen as (val: boolean) => void}
      >
        {pages[page]}
      </ModalComponent>
    </>
  );
};
