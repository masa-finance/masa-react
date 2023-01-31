import React, { useMemo } from 'react';
import { useMasa } from '../../helpers/provider/use-masa';
import { ModalComponent } from '../modal';
import { InterfaceAuthenticate } from './pages/authenticate';
import { InterfaceConnected } from './pages/connected';
import { InterfaceConnector } from './pages/connector';
import { InterfaceCreateCreditScore } from './pages/create-credit-score';
import { InterfaceCreateIdentity } from './pages/createIdentity';

const pages = {
  connector: ({ disable }) => <InterfaceConnector disable={disable} />,
  createIdentity: <InterfaceCreateIdentity />,
  connectedState: <InterfaceConnected />,
  authenticate: <InterfaceAuthenticate />,
  createCreditScore: <InterfaceCreateCreditScore />,
};

export const MasaInterface = ({ disable }: { disable?: boolean }) => {
  const {
    isModalOpen,
    setModalOpen,
    isConnected,
    loading,
    identity,
    loggedIn,
    closeModal,
    scope,
    creditScores,
  } = useMasa();

  const page = useMemo(() => {
    console.log("INTERFACE DATA", { loading, isConnected, identity, loggedIn, creditScores });

    if (!isConnected) return 'connector';
    if (!loggedIn) return 'authenticate';
    if (!identity?.identityId && scope?.includes('identity'))
      return 'createIdentity';
    if (identity && !creditScores?.length && scope?.includes('credit-score'))
      return 'createCreditScore';
    if (isConnected && loggedIn) return 'connectedState';

    return 'connector';
  }, [loading, isConnected, identity, loggedIn, scope, creditScores]);

  return (
    <>
      <ModalComponent
        open={isModalOpen as boolean}
        close={() => closeModal?.()}
        setOpen={setModalOpen as (val: boolean) => void}
      >
        {page === 'connector' ? pages[page]({ disable }) : pages[page]}
      </ModalComponent>
    </>
  );
};
