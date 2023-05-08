import React, { useEffect, useMemo } from 'react';
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
import InterfaceMasaGreen from './pages/masa-green';
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
  switchNetwork: <InterfaceSwitchChain />,
  masaGreen: <InterfaceMasaGreen />,
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
    signer,
    closeModal,
    scope,
    creditScores,
    soulnames,
    forcedPage,
    currentNetwork,
    forceNetwork,
    verbose,
    // setRainbowkitModalCallback,

    openConnectModal,
    useRainbowKit,
  } = useMasa();

  const page = useMemo(() => {
    if (forcedPage) return forcedPage;

    if (!hasWalletAddress) {
      // * feature toggle
      if (useRainbowKit) return null;
      return 'connector';
    }

    if (verbose) {
      console.info({ forceNetwork });
    }

    if (forceNetwork && currentNetwork?.networkName !== forceNetwork) {
      return 'switchNetwork';
    }

    if (!isLoggedIn && signer) return 'authenticate';

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

    // * feature toggle
    // if (useRainbowKit) return null;

    return 'connector';
  }, [
    hasWalletAddress,
    verbose,
    identity,
    isLoggedIn,
    scope,
    signer,
    creditScores,
    soulnames,
    forcedPage,
    forceNetwork,
    currentNetwork,
    useRainbowKit,
  ]);

  const isModal = useMemo(() => {
    return ['createIdentity', 'successIdentityCreate'].includes(String(page));
  }, [page]);

  useEffect(() => {
    if (!useRainbowKit) return; // feature toggle

    // * when user closes connection during login process,
    // * we want to reopen rainbowkit modal not our old connection modal
    if (isModalOpen && !signer && page === 'connector') {
      closeModal?.();
      console.log('opening connect modal');
      openConnectModal?.();
    }
  }, [isModalOpen, closeModal, signer, page, openConnectModal, useRainbowKit]);

  return (
    <>
      <ModalComponent
        open={isModalOpen as boolean}
        close={(): void => closeModal?.()}
        setOpen={setModalOpen as (val: boolean) => void}
        height={isModal ? 340 : undefined}
      >
        <PageSwitcher
          page={page}
          useRainbowKit={useRainbowKit}
          disableMetamask={disableMetamask}
        />
      </ModalComponent>
    </>
  );
};

const PageSwitcher = ({
  page,
  useRainbowKit,
  disableMetamask,
}: {
  page: string | null;
  useRainbowKit: boolean | undefined;
  disableMetamask: boolean | undefined;
}) => {
  if (!useRainbowKit) {
    return page === 'connector'
      ? pages[page]({ disableMetamask })
      : pages[page as string];
  } else {
    return page ? pages[page] : null;
  }
};
