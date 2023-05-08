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
import InterfaceMasaGreen from './pages/masa-green';
import { InterfaceSuccessCreateIdentity } from './pages/success-create-identity';
import { InterfaceSwitchChain } from './pages/switch-chain';
import { useAccount } from 'wagmi';

const pages = {
  connector: ({ disableMetamask }): JSX.Element => (
    <InterfaceConnector disableMetamask={disableMetamask} />
  ),
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
  const { isConnected } = useAccount();

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
    openConnectModal,
    useRainbowKit,
  } = useMasa();

  const page = useMemo(() => {
    if (verbose) {
      console.log('INTERFACE', {
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
        isConnected,
      });
    }

    if (forceNetwork && currentNetwork?.networkName !== forceNetwork) {
      return 'switchNetwork';
    }

    if (!isLoggedIn && isConnected) return 'authenticate';

    if (
      isLoggedIn &&
      (!soulnames || (soulnames && soulnames.length === 0)) &&
      scope?.includes('soulname')
    ) {
      return 'createSoulname';
    }

    if (
      scope?.includes('identity') &&
      isLoggedIn &&
      (!identity || !identity?.identityId)
    ) {
      return 'createIdentity';
    }

    if (identity && !creditScores?.length && scope?.includes('credit-score')) {
      return 'createCreditScore';
    }

    if (hasWalletAddress && isLoggedIn) {
      return 'connectedState';
    }

    if (
      useRainbowKit &&
      isLoggedIn === false &&
      !isConnected &&
      openConnectModal
    ) {
      closeModal?.();
      openConnectModal();
      return 'connector';
    }
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
    isConnected,
    openConnectModal,
    closeModal,
  ]);

  const isModal = useMemo(() => {
    return ['createIdentity', 'successIdentityCreate'].includes(String(page));
  }, [page]);

  return (
    <>
      <ModalComponent
        open={isModalOpen as boolean}
        close={(): void => closeModal?.()}
        setOpen={setModalOpen as (val: boolean) => void}
        height={isModal ? 340 : undefined}
      >
        <PageSwitcher
          page={page as string}
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
  page: string;
  useRainbowKit: boolean | undefined;
  disableMetamask: boolean | undefined;
}) => {
  if (!useRainbowKit) {
    return page === 'connector'
      ? pages[page]({ disableMetamask })
      : pages[page];
  } else {
    return page ? pages[page] : null;
  }
};
