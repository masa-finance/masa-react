import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';
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
import { Gallery } from './pages/gallery';
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
  gallery: <Gallery />,
};

const PageSwitcher = ({
  page,
  useRainbowKit,
  disableMetamask,
}: {
  page: string;
  useRainbowKit?: boolean;
  disableMetamask?: boolean;
}): any => {
  if (!useRainbowKit) {
    return page === 'connector'
      ? pages[page]({ disableMetamask })
      : pages[page];
  }
  if (page === 'rainbowkitConnect') return null;
  return page ? pages[page] : null;
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
    hasAccountAddress,
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
    setRainbowkKitModalCallback,
    // setForcedPage,
    // switchNetworkNew,
    useRainbowKit,
    accountAddress,
  } = useMasa();

  const page = useMemo(() => {
    if (verbose) {
      console.log('INTERFACE', {
        hasWalletAddress,
        hasAccountAddress,
        accountAddress,
        verbose,
        signer,
        identity,
        isLoggedIn,
        scope,
        creditScores,
        soulnames,
        forcedPage,
        forceNetwork,
        currentNetwork,
        useRainbowKit,
        isConnected,
        setModalOpen,
        isModalOpen,
      });
    }

    if (!useRainbowKit) {
      // * old modal flow
      if (forcedPage) return forcedPage;
      if (!hasWalletAddress) return 'connector';

      if (verbose) {
        console.info({ forceNetwork });
      }

      if (forceNetwork && currentNetwork?.networkName !== forceNetwork) {
        return 'switchNetwork';
      }

      if (!isLoggedIn && signer) {
        return 'authenticate';
      }

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
      ) {
        return 'createIdentity';
      }
      if (
        identity &&
        !creditScores?.length &&
        scope?.includes('credit-score')
      ) {
        return 'createCreditScore';
      }
      if (hasAccountAddress && isLoggedIn) return 'connectedState';

      return 'connector';
    }
    // * rainbowkit logic
    if (forcedPage) return forcedPage;

    if (isConnected) {
      // * user does not have a wallet
      if (!hasAccountAddress) {
        setModalOpen?.(false);
        openConnectModal?.();
        console.log('user does not have wallet but is connected', {
          openConnectModal,
          hasAccountAddress,
          hasWalletAddress,
        });

        setRainbowkKitModalCallback?.(() => () => {
          console.log('modalcallback !hasAccountAddress');
          // setForcedPage?.('authenticate');
          setModalOpen?.(true);
        });

        return 'rainbowkitConnect';
      }
      // console.log({ currentNetwork });
      if (forceNetwork && currentNetwork?.networkName !== forceNetwork) {
        // switchNetworkNew?.(forceNetwork);
        // return null;
        console.log({ currentNetwork, forceNetwork });
        if (!isModalOpen) setModalOpen?.(true);
        console.log('return switchnetwork');
        return 'switchNetwork';
      }
    }

    // * connected with wallet but not logged in to masa
    if (!isLoggedIn && signer && !hasAccountAddress) {
      if (!openConnectModal) {
        return 'authenticate';
      }

      setModalOpen?.(false);
      openConnectModal?.();

      setRainbowkKitModalCallback?.(() => () => {
        // setForcedPage?.('authenticate');
        setModalOpen?.(true);
      });

      return 'authenticate';
    }

    if (
      isLoggedIn &&
      (!soulnames || (soulnames && soulnames.length === 0)) &&
      scope?.includes('soulname')
    ) {
      // setForcedPage?.('createSoulname');
      return 'createSoulname';
    }

    if (
      scope?.includes('identity') &&
      isLoggedIn &&
      (!identity || !identity?.identityId)
    ) {
      // setForcedPage?.('createIdentity');
      return 'createIdentity';
    }

    if (identity && !creditScores?.length && scope?.includes('credit-score')) {
      // setForcedPage?.('createCreditScore');
      return 'createCreditScore';
    }

    if (hasAccountAddress && isLoggedIn) return 'connectedState';
    // return 'authenticate';

    // Removed this because it was causing a bug where the modal was openning at the beginning of the flow
    // openConnectModal?.();

    setRainbowkKitModalCallback?.(() => () => {
      // setForcedPage?.('authenticate');
      setModalOpen?.(true);
    });

    if (hasAccountAddress) {
      return 'authenticate';
    }
    return 'rainbowkitConnect';
  }, [
    hasWalletAddress,
    verbose,
    identity,
    isLoggedIn,
    scope,
    creditScores,
    soulnames,
    forcedPage,
    forceNetwork,
    currentNetwork,
    isConnected,
    openConnectModal,
    // closeModal,
    useRainbowKit,
    hasAccountAddress,
    signer,
    isModalOpen,
    setModalOpen,
    setRainbowkKitModalCallback,
    signer,
  ]);

  const isModal = useMemo(
    () => ['createIdentity', 'successIdentityCreate'].includes(String(page)),
    [page]
  );

  return (
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
  );
};
