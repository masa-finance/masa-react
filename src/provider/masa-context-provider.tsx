import { EnvironmentName, Masa } from '@masa-finance/masa-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createNewMasa, SupportedNetworks } from '../helpers';
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
import { MASA_CONTEXT } from './masa-context';
import { MasaShape } from './masa-shape';
import { useScopes } from './modules/scopes/scopes';

export interface ArweaveConfig {
  port?: string;
  host?: string;
  protocol?: string;
  logging?: boolean;
}

export type EnvironmentNameEx = EnvironmentName & ('local' | 'stage');

export interface MasaContextProviderProps extends MasaShape {
  children: React.ReactNode;
  company?: string;
  noWallet?: boolean;
  signer?: Wallet | Signer;
  environmentName?: EnvironmentNameEx;
  arweaveConfig?: ArweaveConfig;
  verbose?: boolean;
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
}: MasaContextProviderProps): JSX.Element => {
  // masa
  const [masaInstance, setMasaInstance] = useState<Masa | undefined>();

  // provider
  const [provider, setProvider] = useState<Wallet | Signer | undefined>(signer);

  // wallet
  const { walletAddress, isWalletLoading, isConnected } = useWallet(
    masaInstance,
    provider
  );
  // session
  const { isLoggedIn, handleLogin, handleLogout, isSessionLoading } =
    useSession(masaInstance, walletAddress);

  // network
  const { switchNetwork, network } = useNetwork(provider);

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
    walletAddress,
    identity
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
    soulnames ?? [],
    isLoggedIn
  );

  // modal
  const {
    isModalOpen,
    setModalOpen,
    setModalCallback,
    closeModal,
    forcedPage,
    setForcedPage,
  } = useModal(
    masaInstance,
    isLoggedIn,
    isConnected,
    network,
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
      console.log({ forcedPage });
      setModalOpen(true);
      setForcedPage?.(null);
      if (options?.scope) setScope(options.scope);
      if (typeof options?.callback === 'function') {
        setModalCallback(() => options?.callback);
      }
    },
    [setModalOpen, setModalCallback, setScope, setForcedPage, forcedPage]
  );

  const openMintSoulnameModal = useCallback(
    (mintCallback?: () => void) => {
      setForcedPage?.('createSoulname');
      setModalOpen(true);
      const cb = () => {
        setForcedPage?.(null);
        if (mintCallback) mintCallback();
      };

      setModalCallback(() => cb);
    },
    [setForcedPage, setModalOpen, setModalCallback]
  );

  useEffect(() => {
    const loadMasa = async (): Promise<void> => {
      if (!provider) return;

      const masa: Masa | undefined = await createNewMasa({
        signer: provider,
        environmentName,
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
    network,
  ]);

  const context: MasaShape = {
    // masa instance
    masa: masaInstance as Masa,
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
    // wallet
    walletAddress,
    isWalletLoading,
    isConnected,

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
    network,
    SupportedNetworks,
    switchNetwork,
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
