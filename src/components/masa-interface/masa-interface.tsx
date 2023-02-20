import React, { useMemo } from 'react';
import { useMasa } from '../../provider';
import { ModalComponent } from '../modal';
import {
  InterfaceAuthenticate,
  InterfaceConnected,
  InterfaceConnector,
  InterfaceCreateCreditScore,
  InterfaceCreateIdentity,
} from './pages';
import { InterfaceSwitchChain } from './pages/switch-chain';

const pages = {
  connector: ({ disable }: { disable?: boolean }): JSX.Element => (
    <InterfaceConnector disable={disable} />
  ),
  createIdentity: <InterfaceCreateIdentity />,
  connectedState: <InterfaceConnected />,
  authenticate: <InterfaceAuthenticate />,
  createCreditScore: <InterfaceCreateCreditScore />,
  switchNetwork: <InterfaceSwitchChain />,
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
    identity,
    loggedIn,
    closeModal,
    scope,
    creditScores,
  } = useMasa();

  const page = useMemo(() => {
    if (!isConnected) return 'connector';

    // if (network && !chain?.name.includes(network)) return 'switchNetwork';
    if (!loggedIn) return 'authenticate';
    if (!identity?.identityId && scope?.includes('identity'))
      return 'createIdentity';
    if (identity && !creditScores?.length && scope?.includes('credit-score'))
      return 'createCreditScore';
    if (isConnected && loggedIn) return 'connectedState';

    return 'connector';
  }, [isConnected, identity, loggedIn, scope, creditScores]);

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
