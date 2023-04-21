import {
  EnvironmentName,
  Masa,
  SupportedNetworks,
  SoulNameErrorCodes,
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
}

export const MasaContextProvider = ({
  children,
  // masa-react branding
  company,
  // use no wallet
  noWallet,
  // signer used in masa instance
  signer,
  // env used in masa instance
  environmentName = 'dev' as EnvironmentNameEx,
  // arweave config used in masa instance
  arweaveConfig,
  // verbose on /off
  verbose = false,
  // force specific network
  forceNetwork,
  useRainbowKitWalletConnect = true,
}: MasaContextProviderProps): JSX.Element => {
  // masa
  const [masaInstance, setMasaInstance] = useState<Masa | undefined>();

  // provider
  const [provider, setProvider] = useState<Wallet | Signer | undefined>(signer);

  // wallet
  const { walletAddress, isWalletLoading, hasWalletAddress } = useWallet(
    masaInstance,
    provider
  );
  // session
  const { isLoggedIn, handleLogin, handleLogout, isSessionLoading } =
    useSession(masaInstance, walletAddress);

  // network
  const { switchNetwork, currentNetwork } = useNetwork(provider);

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
  const { openChainModal, openConnectModal, openAccountModal } =
    useRainbowKit();
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
  } = useModal(isLoggedIn, hasWalletAddress, areScopesFullfiled);

  // global loading flag
  const isLoading = useMemo(() => {
    return (
      !masaInstance ||
      isWalletLoading ||
      isSessionLoading ||
      isIdentityLoading ||
      isSoulnamesLoading ||
      isCreditScoresLoading ||
      isGreensLoading
    );
  }, [
    masaInstance,
    isWalletLoading,
    isSessionLoading,
    isIdentityLoading,
    isSoulnamesLoading,
    isCreditScoresLoading,
    isGreensLoading,
  ]);

  const connect = useCallback(
    (options?: { scope?: string[]; callback?: () => void }) => {
      if (verbose) {
        console.info({ forcedPage });
      }

      if (useRainbowKitWalletConnect) openConnectModal?.();
      else setModalOpen(true);
      setForcedPage?.(null);

      if (options?.scope) {
        setScope(options.scope);
      }

      if (typeof options?.callback === 'function') {
        setModalCallback(() => options?.callback);
      }
    },
    [
      // setModalOpen,
      setModalCallback,
      setScope,
      setForcedPage,
      forcedPage,
      openConnectModal,
      verbose,
      setModalOpen,
      useRainbowKitWalletConnect,
    ]
  );

  useEffect(() => {
    const loadMasa = (): void => {
      if (!provider) return;

      const masa: Masa | undefined = createNewMasa({
        signer: provider,
        environmentName,
        networkName: currentNetwork?.networkName,
        arweaveConfig,
        verbose,
      });

      setMasaInstance(masa);
    };

    void loadMasa();
  }, [
    provider,
    noWallet,
    walletAddress,
    arweaveConfig,
    environmentName,
    verbose,
    currentNetwork,
  ]);

  const context: MasaShape = {
    // masa instance
    masa: masaInstance,
    verbose: masaInstance?.config.verbose,

    // global loading
    isLoading,

    // masa-react global connect
    connect,

    // general config
    scope,
    areScopesFullfiled,
    company,

    // provider handling
    provider,
    setProvider,

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
    openConnectModal,
    openChainModal,
    openAccountModal,
  };

  return (
    <MasaContext.Provider value={context}>{children}</MasaContext.Provider>
  );
};
