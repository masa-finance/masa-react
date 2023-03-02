import React, { useMemo } from 'react';
import { useMasa, useMetamask } from '../../provider';
import { ModalComponent } from '../modal';
import {
  InterfaceAuthenticate,
  InterfaceConnected,
  InterfaceConnector,
  InterfaceCreateCreditScore,
  InterfaceCreateIdentity,
} from './pages';
import { InterfaceCreateSoulname } from './pages/create-soulname';
import { InterfaceSwitchChain } from './pages/switch-chain';

const pages = {
  connector: ({
    disableMetamask,
  }: {
    disableMetamask?: boolean;
  }): JSX.Element => <InterfaceConnector disableMetamask={disableMetamask} />,
  createIdentity: <InterfaceCreateIdentity />,
  createSoulname: <InterfaceCreateSoulname />,
  connectedState: <InterfaceConnected />,
  authenticate: <InterfaceAuthenticate />,
  createCreditScore: <InterfaceCreateCreditScore />,
  switchNetwork: <InterfaceSwitchChain />,
};

export const MasaInterface = ({
  disableMetamask,
}: {
  disableMetamask?: boolean;
}): JSX.Element => {
  useMetamask({ disabled: disableMetamask });

  const {
    isModalOpen,
    setModalOpen,
    isConnected,
    identity,
    isLoggedIn,
    provider,
    closeModal,
    scope,
    creditScores,
    soulnames,
    forcedPage,
  } = useMasa();

  const page = useMemo(() => {
    if (forcedPage) return forcedPage;
    if (!isConnected) return 'connector';

    console.log({
      forcedPage,
      soulnames,
      scope,
      isLoggedIn,
      identity,
      isConnected,
      provider,
    });

    // if (network && !chain?.name.includes(network)) return 'switchNetwork';
    if (!isLoggedIn && provider) return 'authenticate';
    if (!identity?.identityId && scope?.includes('identity'))
      return 'createIdentity';
    if (soulnames && soulnames.length === 0 && scope?.includes('soulname'))
      return 'createSoulname';
    if (identity && !creditScores?.length && scope?.includes('credit-score'))
      return 'createCreditScore';
    if (isConnected && isLoggedIn) return 'connectedState';

    return 'connector';
  }, [
    isConnected,
    identity,
    isLoggedIn,
    scope,
    provider,
    creditScores,
    soulnames,
    forcedPage,
  ]);

  return (
    <>
      <ModalComponent
        open={isModalOpen as boolean}
        close={(): void => closeModal?.()}
        setOpen={setModalOpen as (val: boolean) => void}
      >
        {page === 'connector' ? pages[page]({ disableMetamask }) : pages[page]}
      </ModalComponent>
    </>
  );
};
