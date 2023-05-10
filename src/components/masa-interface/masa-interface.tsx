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
  } = useMasa();

  const page = useMemo(() => {
    if (verbose) {
      console.log('INTERFACE', {
        hasWalletAddress,
        hasAccountAddress,
        verbose,
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
    } else {
      // * rainbowkit logic
      if (forcedPage) return forcedPage;

      if (isConnected) {
        // * user does not have a wallet
        if (!hasAccountAddress) {
          openConnectModal?.();
          console.log('user does not have wallet but is connected', {
            openConnectModal,
            hasAccountAddress,
            hasWalletAddress,
          });

          setRainbowkKitModalCallback?.(() => {
            return () => {
              console.log('modalcallback !hasAccountAddress');
              // setForcedPage?.('authenticate');
              setModalOpen?.(true);
            };
          });
          console.log('!isLoggedIn && signer return rainbowkit');
          return 'rainbowkitConnect';
          return;
        }
      }

      if (forceNetwork && currentNetwork?.networkName !== forceNetwork) {
        // switchNetworkNew?.(forceNetwork);
        // return null;
        return 'switchNetwork';
      }

      // * connected with wallet but not logged in to masa
      if (!isLoggedIn && signer && !hasAccountAddress) {
        if (!openConnectModal) {
          return 'authenticate';
        }

        openConnectModal?.();
        console.log({
          openConnectModal,
          hasAccountAddress,
          hasWalletAddress,
          isLoggedIn,
          signer,
        });
        setRainbowkKitModalCallback?.(() => {
          return () => {
            console.log(
              'modalcallback !isLoggedIn && signer && !hasAccountAddress'
            );
            // setForcedPage?.('authenticate');
            setModalOpen?.(true);
          };
        });

        console.log(
          '!isLoggedIn && signer && !hasAccountAddress return rainbowkit'
        );

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
        console.log('returning create identity', { isLoggedIn, identity });
        return 'createIdentity';
      }

      if (
        identity &&
        !creditScores?.length &&
        scope?.includes('credit-score')
      ) {
        // setForcedPage?.('createCreditScore');
        return 'createCreditScore';
      }

      if (hasAccountAddress && isLoggedIn) return 'connectedState';
      // return 'authenticate';

      console.log({ openConnectModal, hasAccountAddress, hasWalletAddress });
      openConnectModal?.();
      setRainbowkKitModalCallback?.(() => {
        return () => {
          console.log('modalcallback end of function');
          // setForcedPage?.('authenticate');
          setModalOpen?.(true);
        };
      });
      console.log('end of function return rainbowkit');
      if (hasAccountAddress) return 'authenticate';
      return 'rainbowkitConnect';
    }
    // if (useRainbowKit) {

    // }
    // if (forcedPage) return forcedPage;

    // if (
    //   forceNetwork &&
    //   hasWalletAddress &&
    //   currentNetwork?.networkName !== forceNetwork
    // ) {
    //   return 'switchNetwork';
    // }

    // if (useRainbowKit && !isLoggedIn && isConnected) return 'authenticate';
    // if (!useRainbowKit && !isLoggedIn && hasWalletAddress)
    //   return 'authenticate';

    // if (
    //   isLoggedIn &&
    //   (!soulnames || (soulnames && soulnames.length === 0)) &&
    //   scope?.includes('soulname')
    // ) {
    //   return 'createSoulname';
    // }

    // if (
    //   scope?.includes('identity') &&
    //   isLoggedIn &&
    //   (!identity || !identity?.identityId)
    // ) {
    //   return 'createIdentity';
    // }

    // if (identity && !creditScores?.length && scope?.includes('credit-score')) {
    //   return 'createCreditScore';
    // }

    // if (hasWalletAddress && isLoggedIn) {
    //   return 'connectedState';
    // }

    // if (
    //   useRainbowKit &&
    //   isLoggedIn === false &&
    //   !isConnected &&
    //   openConnectModal
    // ) {
    //   closeModal?.();
    //   openConnectModal();
    //   return 'connector';
    // }
    // return 'connector';
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
  ]);

  const isModal = useMemo(() => {
    return ['createIdentity', 'successIdentityCreate'].includes(String(page));
  }, [page]);

  console.log('PAGE', page);
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
  useRainbowKit?: boolean;
  disableMetamask?: boolean;
}) => {
  if (!useRainbowKit) {
    return page === 'connector'
      ? pages[page]({ disableMetamask })
      : pages[page];
  } else {
    if (page === 'rainbowkitConnect') return null;
    return page ? pages[page] : null;
  }
};
