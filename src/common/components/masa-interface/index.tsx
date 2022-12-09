import React, { useMemo } from 'react';
import { useMasa } from '../../helpers/provider/use-masa';
import { ModalComponent } from '../modal';
import { InterfaceAuthenticate } from './pages/authenticate';
import { InterfaceConnected } from './pages/connected';
import { InterfaceConnector } from './pages/connector';
import { InterfaceCreateCreditReport } from './pages/create-credit-report';
import { InterfaceCreateIdentity } from './pages/createIdentity';

const pages = {
  connector: <InterfaceConnector />,
  createIdentity: <InterfaceCreateIdentity />,
  connectedState: <InterfaceConnected />,
  authenticate: <InterfaceAuthenticate />,
  createCreditReport: <InterfaceCreateCreditReport />,
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
    creditReports,
  } = useMasa();

  const page = useMemo(() => {
    console.log({ loading, isConnected, identity, loggedIn, creditReports });

    if (!isConnected) return 'connector';
    if (!loggedIn) return 'authenticate';
    if (!identity && scope?.includes('identity')) return 'createIdentity';
    if (identity && !creditReports?.length && scope?.includes('credit-score'))
      return 'createCreditReport';
    if (isConnected && loggedIn) return 'connectedState';

    return 'connector';
  }, [loading, isConnected, identity, loggedIn, scope, creditReports]);

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
