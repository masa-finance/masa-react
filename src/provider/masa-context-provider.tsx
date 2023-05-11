import {
  EnvironmentName,
  Masa,
  SoulNameErrorCodes,
  SupportedNetworks,
} from '@masa-finance/masa-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createNewMasa } from '../helpers';
import {
  useCreditScores,
  useGreen,
  useIdentity,
  useModal,
  useNetwork,
  useSession,
  useSoulnames,
  useWallet,
} from './modules';
import { Signer, Wallet } from 'ethers';
import { MasaContext } from './masa-context';
import { MasaShape } from './masa-shape';
import { useScopes } from './modules/scopes/scopes';
import { useRainbowKit } from './use-rainbowkit';
import { useWagmi } from './modules/wagmi';
import { useNetworkSwitch } from './use-network-switch';
import { MasaNetworks } from './configured-rainbowkit-provider/utils';
import { useLogout } from './hooks';
import { useAccountState } from './use-account-state';

export { SoulNameErrorCodes };

export interface ArweaveConfig {
  port?: string;
  host?: string;
  protocol?: string;
  logging?: boolean;
}

export type EnvironmentNameEx = EnvironmentName & ('local' | 'stage');

export interface MasaContextProviderProps extends MasaShape {
  noWallet?: boolean;
  signer?: Wallet | Signer;
  environmentName?: EnvironmentNameEx;
  arweaveConfig?: ArweaveConfig;
  useRainbowKitWalletConnect?: boolean;
  chainsToUse?: Array<keyof MasaNetworks>;
  walletsToUse?: string[];
}

export const MasaContextProvider = ({
  children,
  // masa-react branding
  company,
  // use no wallet
  // signer used in masa instance
  // signer,
  // env used in masa instance
  environmentName = 'dev' as EnvironmentNameEx,
  // arweave config used in masa instance
  arweaveConfig,
  // verbose on /off
  verbose = false,
  // force specific network
  forceNetwork,
  useRainbowKitWalletConnect = false,
}: MasaContextProviderProps): JSX.Element => {
  // masa
  const [masaInstance, setMasaInstance] = useState<Masa | undefined>();
  const [signer, setSigner] = useState<Signer | undefined>();

  // wallet
  const { walletAddress, isWalletLoading, hasWalletAddress, reloadWallet } =
    useWallet(masaInstance, signer);

  // session
  const { isLoggedIn, handleLogin, handleLogout, isSessionLoading } =
    useSession(masaInstance, walletAddress);

  // provider
  const { isLoading: wagmiLoading } = useWagmi({
    setSigner,
    logout: handleLogout,
  });

  // network
  const { switchNetwork, currentNetwork } = useNetwork({
    provider: signer,
    useRainbowKitWalletConnect,
  });
  const { switchNetwork: switchNetworkNew, currentNetwork: currentNetworkNew } =
    useNetworkSwitch();

  // identity
  const {
    identity,
    handlePurchaseIdentity,
    handlePurchaseIdentityWithSoulname,
    isIdentityLoading,
    reloadIdentity,
  } = useIdentity(masaInstance, walletAddress);

  const {
    isConnected,
    isDisconnected,
    // isDisconnected,
    // isLoggedIn: loggedIn,
    // isLoggingOut,
    hasAccountAddress,
    accountAddress,
  } = useAccountState({
    masa: masaInstance,
    identity,
    reloadIdentity,
    walletAddress,
    signer,
    isLoggedIn,
    hasWalletAddress,
    reloadWallet,
  });

  // console.log({ isDisconnected, loggedIn, isLoggingOut, identity });
  // soul names
  const { soulnames, isSoulnamesLoading, reloadSoulnames } = useSoulnames(
    masaInstance,
    walletAddress
  );

  // credit scores
  const {
    creditScores,
    isCreditScoresLoading,
    handleCreateCreditScore,
    reloadCreditScores,
  } = useCreditScores(masaInstance, walletAddress, identity);

  // greens
  const {
    greens,
    isGreensLoading,
    handleGenerateGreen,
    handleCreateGreen,
    reloadGreens,
  } = useGreen(masaInstance, walletAddress);

  // scope
  const { scope, setScope, areScopesFullfiled } = useScopes(
    soulnames,
    identity,
    isLoggedIn,
    masaInstance?.config.verbose
  );

  // rainbowkit
  const {
    openChainModal,
    openConnectModal,
    openAccountModal,
    setRainbowKitModalCallback,
  } = useRainbowKit();

  const { logout } = useLogout({
    onLogoutStart: handleLogout,
    onLogoutFinish: () => console.log('finished logout'),
    walletAddress,
    masa: masaInstance,
    signer,
  });

  // modal
  const {
    isModalOpen,
    setModalOpen,
    setModalCallback,
    closeModal,
    forcedPage,
    setForcedPage,
    openMintSoulnameModal,
    openMintMasaGreen,
    useModalSize,
    modalSize,
  } = useModal(
    isLoggedIn,
    hasAccountAddress, // used to be hasWalletAddress
    areScopesFullfiled
  );

  // global loading flag
  const isLoading = useMemo(() => {
    return (
      !masaInstance ||
      isWalletLoading ||
      isSessionLoading ||
      isIdentityLoading ||
      isSoulnamesLoading ||
      isCreditScoresLoading ||
      isGreensLoading ||
      wagmiLoading
    );
  }, [
    masaInstance,
    isWalletLoading,
    isSessionLoading,
    isIdentityLoading,
    isSoulnamesLoading,
    isCreditScoresLoading,
    isGreensLoading,
    wagmiLoading,
  ]);

  // const providerWagmi = useProvider();

  // useEffect(() => {
  //   if (forceNetwork && currentNetwork?.networkName !== forceNetwork)
  //     openSwitchChainModal();
  //   else if (!isLoggedIn && provider) openAuthenticateModal();
  //   if (isLoggedIn) {
  //     if (!soulnames || (soulnames && soulnames.length === 0)) {
  //       // TODO: add scopes
  //       openCreateSoulnameModal();
  //     }
  //   }
  // }, [
  //   isLoggedIn,
  //   provider,
  //   forceNetwork,
  //   soulnames,
  //   currentNetwork,
  //   // openAuthenticateModal,
  //   // openSwitchChainModal,
  //   // openCreateSoulnameModal,
  // ]);

  const connect = useCallback(
    (options?: { scope?: string[]; callback?: () => void }) => {
      // if (useRainbowKitWalletConnect) {
      //   openConnectModal?.();
      //   // setRainbowKitModalCallback(() => {
      //   //   return () => {
      //   //     openAuthenticateModal();
      //   //     openConnectedModal();
      //   //   };
      //   // });
      //   // return;
      // }

      if (verbose) {
        console.info({ forcedPage, useRainbowKitWalletConnect, options });
      }

      // * feature toggle, to be removed soon
      if (useRainbowKitWalletConnect) {
        // * set the callback to open masa modal after rainbowkit modal is closed
        setRainbowKitModalCallback(() => {
          return () => {
            setModalOpen(true);
            // setForcedPage?.(null);
          };
        });

        openConnectModal?.();
        console.log('OPENING RK MODAL');
      } else {
        setModalOpen(true);
      }
      // console.log('set forced page null');
      setForcedPage?.(null);
      if (options?.scope) {
        setScope(options.scope);
      }

      if (typeof options?.callback === 'function') {
        if (useRainbowKitWalletConnect) {
          // setRainbowKitModalCallback(options?.callback);
        }
        setModalCallback(() => options?.callback);
      }
    },
    [
      setModalOpen,
      setRainbowKitModalCallback,
      setModalCallback,
      setScope,
      setForcedPage,
      forcedPage,
      openConnectModal,
      verbose,
      useRainbowKitWalletConnect,
      // openAuthenticateModal,
      // openConnectedModal,
      // wagmiSigner,
    ]
  );

  useEffect(() => {
    const loadMasa = (): void => {
      if (!signer) return;

      const masa: Masa | undefined = createNewMasa({
        wallet: signer,
        environmentName,
        networkName: currentNetwork?.networkName,
        arweaveConfig,
        verbose,
      });

      setMasaInstance(masa);
    };

    void loadMasa();
  }, [arweaveConfig, environmentName, verbose, currentNetwork, signer]);

  const context: MasaShape = {
    // masa instance
    masa: masaInstance,
    verbose: masaInstance?.config.verbose,

    // global loading
    isLoading,

    // masa-react global connect
    connect,
    logout,

    // general config
    scope,
    areScopesFullfiled,
    company,

    // provider handling
    signer,
    setSigner,

    // modal
    isModalOpen,
    setModalOpen,
    closeModal,
    forcedPage,
    setForcedPage,
    openMintSoulnameModal,
    openMintMasaGreen,
    useModalSize,
    modalSize,

    // wallet
    walletAddress,
    isWalletLoading,
    hasWalletAddress,
    accountAddress,
    hasAccountAddress,
    // identity
    identity,
    isIdentityLoading,
    handlePurchaseIdentity,
    handlePurchaseIdentityWithSoulname,
    reloadIdentity,

    // session
    isLoggedIn,
    isSessionLoading,
    handleLogin,
    handleLogout,

    // credit scores
    creditScores,
    isCreditScoresLoading,
    handleCreateCreditScore,
    reloadCreditScores,

    // soul names
    soulnames,
    isSoulnamesLoading,
    reloadSoulnames,

    // greens
    greens,
    isGreensLoading,
    handleGenerateGreen,
    handleCreateGreen,
    reloadGreens,

    // network
    currentNetwork,
    SupportedNetworks,
    switchNetwork,
    forceNetwork,

    // rainbowkit
    useRainbowKit: useRainbowKitWalletConnect,
    openConnectModal,
    openChainModal,
    openAccountModal,

    // wagmi
    switchNetworkNew,
    currentNetworkNew,
    isConnected,
    isDisconnected,
    // // new-modal
    // openModal,
    // openAuthenticateModal,
    // openConnectedModal,
    // openCreateCreditScoreModal,
    // openCreateIdentityModal,
    // openCreateSoulnameModal,
    // openSuccessCreateIdentityModal,
    // openSwitchChainModal,
    // openInterfaceMasaGreen,
  };

  return (
    <MasaContext.Provider value={context}>{children}</MasaContext.Provider>
  );
};
