import React, { useMemo } from 'react';
import { useMasa } from '../../helpers';
import { ModalComponent } from '../modal';
import {
  InterfaceAuthenticate,
  InterfaceConnected,
  InterfaceConnector,
  InterfaceCreateCreditScore,
  InterfaceCreateIdentity,
} from './pages';

const pages = {
  connector: ({ disable }): JSX.Element => (
    <InterfaceConnector disable={disable} />
  ),
  createIdentity: <InterfaceCreateIdentity />,
  connectedState: <InterfaceConnected />,
  authenticate: <InterfaceAuthenticate />,
  createCreditScore: <InterfaceCreateCreditScore />,
};

export const MasaInterface = ({
  disable,
}: {
  disable?: boolean;
}): JSX.Element => {
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
        close={(): void => closeModal?.()}
        setOpen={setModalOpen as (val: boolean) => void}
      >
        {page === 'connector' ? pages[page]({ disable }) : pages[page]}
      </ModalComponent>
    </>
  );
};
