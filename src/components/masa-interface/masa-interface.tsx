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
import { InterfaceErrorModal } from './pages/error-modal';
import { InterfaceSuccessCreateIdentity } from './pages/success-create-identity';
import { InterfaceSwitchChain } from './pages/switch-chain';

const pages = {
  connector: ({
    disableMetamask,
  }: {
    disableMetamask?: boolean;
  }): JSX.Element => <InterfaceConnector disableMetamask={disableMetamask} />,
  createIdentity: <InterfaceCreateIdentity />,
  successIdentityCreate: <InterfaceSuccessCreateIdentity />,
  createSoulname: <InterfaceCreateSoulname />,
  connectedState: <InterfaceConnected />,
  authenticate: <InterfaceAuthenticate />,
  createCreditScore: <InterfaceCreateCreditScore />,
  switchNetwork: <InterfaceSwitchChain />
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
    hasWalletAddress,
    identity,
    isLoggedIn,
    provider,
    closeModal,
    scope,
    creditScores,
    soulnames,
    forcedPage,
    currentNetwork,
    forceNetwork,
    verbose,
  } = useMasa();

  const page = useMemo(() => {
    if (forcedPage) return forcedPage;
    if (!hasWalletAddress) return 'connector';

    if (verbose) {
      console.info({ forceNetwork });
    }

    if (forceNetwork && currentNetwork?.networkName !== forceNetwork) {
      return 'switchNetwork';
    }

    if (!isLoggedIn && provider) return 'authenticate';

    if (
      isLoggedIn &&
      (!soulnames || (soulnames && soulnames.length === 0)) &&
      scope?.includes('soulname')
    )
      return 'createSoulname';

    if (
      scope?.includes('identity') &&
      isLoggedIn &&
      (!identity || !identity?.identityId)
    )
      return 'createIdentity';

    if (identity && !creditScores?.length && scope?.includes('credit-score'))
      return 'createCreditScore';

    if (hasWalletAddress && isLoggedIn) return 'connectedState';

    return 'connector';
  }, [
    hasWalletAddress,
    verbose,
    identity,
    isLoggedIn,
    scope,
    provider,
    creditScores,
    soulnames,
    forcedPage,
    forceNetwork,
    currentNetwork,
  ]);

  const isModal = useMemo(() => {
    return ['createIdentity', 'successIdentityCreate'].includes(page);
  }, [page]);

  return (
    <>
      <ModalComponent
        open={isModalOpen as boolean}
        close={(): void => closeModal?.()}
        setOpen={setModalOpen as (val: boolean) => void}
        height={isModal ? 340 : undefined}
      >
        {page === 'connector' ? pages[page]({ disableMetamask }) : pages[page]}
      </ModalComponent>
    </>
  );
};
