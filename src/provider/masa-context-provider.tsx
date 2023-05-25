import {
  EnvironmentName,
  Masa,
  SupportedNetworks,
} from '@masa-finance/masa-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Signer } from 'ethers';
import { CustomGallerySBT } from 'components/masa-interface/pages/gallery/gallery';
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
import { MasaContext } from './masa-context';
import { MasaShape } from './masa-shape';
import { useScopes } from './modules/scopes/scopes';
import { useCustomGallerySBT, useCustomSBT } from './modules/custom-sbts';
import { useRainbowKit } from './use-rainbowkit';
import { useWagmi } from './modules/wagmi';
import { useNetworkSwitch } from './use-network-switch';

import { useLogout } from './hooks';
import { useAccountState } from './use-account-state';

export interface ArweaveConfig {
  port?: string;
  host?: string;
  protocol?: string;
  logging?: boolean;
}

export type EnvironmentNameEx = EnvironmentName & ('local' | 'stage');

export interface MasaContextProviderProps extends MasaShape {
  environmentName?: EnvironmentNameEx;
  arweaveConfig?: ArweaveConfig;
  customGallerySBT?: CustomGallerySBT[];
  fullScreenGallery?: boolean;
  apiUrl?: string;
  useRainbowKitWalletConnect?: boolean;

  // noWallet?: boolean;
  // signer?: Signer;
  // chainsToUse?: Array<keyof MasaNetworks>;
  // walletsToUse?: string[];
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
  // custom SBT render for gallery
  customGallerySBT,
  // render gallery in full screen
  fullScreenGallery,
  // api url override
  apiUrl,
  useRainbowKitWalletConnect = false,
}: MasaContextProviderProps): JSX.Element => {
  // masa
  const [masaInstance, setMasaInstance] = useState<Masa | undefined>();
  const [signer, setSigner] = useState<Signer | undefined>();

  // wallet
  const { walletAddress, isWalletLoading, hasWalletAddress, reloadWallet } =
    useWallet(masaInstance, signer);

  const {
    isConnected,
    isDisconnected,
    hasAccountAddress,
    accountAddress,
    walletName,
  } = useAccountState({
    masa: masaInstance,
    walletAddress,
    signer,
    hasWalletAddress,
    reloadWallet,
  });

  // session
  const { isLoggedIn, handleLogin, handleLogout, isSessionLoading } =
    useSession(masaInstance, accountAddress);

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
  const {
    switchNetwork: switchNetworkNew,
    currentNetwork: currentNetworkNew,
    canProgramaticallySwitchNetwork,
  } = useNetworkSwitch();

  // custom SBTs
  const { customContracts, handleAddSBT, refetchContracts } =
    useCustomGallerySBT({
      masa: masaInstance,
      customGallerySBT,
      walletAddress: accountAddress,
    });

  const { customSBTs, isLoading: isLoadingCustomSBTs } = useCustomSBT({
    masa: masaInstance,
    customContracts,
    walletAddress: accountAddress,
  });

  // identity
  const {
    identity,
    handlePurchaseIdentity,
    handlePurchaseIdentityWithSoulname,
    isIdentityLoading,
    reloadIdentity,
  } = useIdentity(masaInstance, walletAddress);

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
  } = useCreditScores(masaInstance, accountAddress, identity);

  // greens
  const {
    greens,
    isGreensLoading,
    handleGenerateGreen,
    handleCreateGreen,
    reloadGreens,
  } = useGreen(masaInstance, accountAddress);

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
    openGallery,
    modalSize,
  } = useModal(
    isLoggedIn,
    hasAccountAddress, // used to be hasWalletAddress
    areScopesFullfiled
  );

  // global loading flag
  const isLoading = useMemo(
    () =>
      !masaInstance ||
      isWalletLoading ||
      isSessionLoading ||
      isIdentityLoading ||
      isSoulnamesLoading ||
      isCreditScoresLoading ||
      isGreensLoading ||
      wagmiLoading,
    [
      masaInstance,
      isWalletLoading,
      isSessionLoading,
      isIdentityLoading,
      isSoulnamesLoading,
      isCreditScoresLoading,
      isGreensLoading,
      wagmiLoading,
    ]
  );

  const connect = useCallback(
    (options?: { scope?: string[]; callback?: () => void }) => {
      if (verbose) {
        console.info({ forcedPage, useRainbowKitWalletConnect, options });
      }

      // * feature toggle, to be removed soon
      if (useRainbowKitWalletConnect) {
        // * set the callback to open masa modal after rainbowkit modal is closed
        setRainbowKitModalCallback(() => () => {
          setModalOpen(true);
          // setForcedPage?.(null);
        });

        openConnectModal?.();
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
        signer,
        environmentName,
        networkName: currentNetwork?.networkName,
        arweaveConfig,
        verbose,
        apiUrl,
      });

      setMasaInstance(masa);
    };

    void loadMasa();
  }, [arweaveConfig, environmentName, verbose, currentNetwork, signer, apiUrl]);

  const context: MasaShape = useMemo(() => {
    const masaShape: MasaShape = {
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
      openGallery,
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

      // gallery
      customGallerySBT,
      fullScreenGallery,

      // custom SBTs
      customSBTs,
      handleAddSBT,
      refetchContracts,
      isLoadingCustomSBTs,

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
      canProgramaticallySwitchNetwork,
      walletName,
    };
    return masaShape;
  }, [
    // masa instance
    masaInstance,

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
    openGallery,
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
    switchNetwork,
    forceNetwork,

    // gallery
    customGallerySBT,
    fullScreenGallery,

    // custom SBTs
    customSBTs,
    handleAddSBT,
    refetchContracts,
    isLoadingCustomSBTs,

    // rainbowkit
    useRainbowKitWalletConnect,
    openConnectModal,
    openChainModal,
    openAccountModal,

    // wagmi
    switchNetworkNew,
    currentNetworkNew,
    isConnected,
    isDisconnected,
    canProgramaticallySwitchNetwork,
    walletName,
  ]);

  return (
    <MasaContext.Provider value={context}>{children}</MasaContext.Provider>
  );
};

export { SoulNameErrorCodes } from '@masa-finance/masa-sdk';
