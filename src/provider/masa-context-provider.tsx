import { EnvironmentName, Masa, NetworkName } from '@masa-finance/masa-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createNewMasa, SupportedNetworks } from '../helpers';
import {
  useCreditScores,
  useGreen,
  useIdentity,
  useModal,
  useNetwork,
  useProvider,
  useSession,
  useSoulnames,
  useWallet,
} from './modules';
import { Signer, Wallet } from 'ethers';
import { MASA_CONTEXT } from './masa-context';
import { MasaShape } from './masa-shape';

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
  environmentName?: EnvironmentNameEx;
  signer?: Wallet | Signer;
  noWallet?: boolean;
  arweaveConfig?: ArweaveConfig;
  verbose?: boolean;
  networkName?: NetworkName;
}

export const MasaContextProvider = ({
  children,
  company,
  environmentName = 'dev' as EnvironmentNameEx,
  verbose = false,
  signer,
  noWallet,
  arweaveConfig,
  networkName,
}: MasaContextProviderProps): JSX.Element => {
  // masa
  const [masaInstance, setMasaInstance] = useState<Masa | undefined>();
  // scope
  const [scope, setScope] = useState<string[]>([]);

  // provider
  const { provider, setProvider, isProviderMissing, setIsProviderMissing } =
    useProvider(signer);

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

  // modal
  const { isModalOpen, setModalOpen, setModalCallback, closeModal } = useModal(
    networkName,
    isLoggedIn,
    isConnected,
    network
  );

  // identity
  const {
    identity,
    handlePurchaseIdentity,
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
      setModalOpen(true);
      if (options?.scope) setScope(options.scope);
      if (typeof options?.callback === 'function') {
        setModalCallback(() => options?.callback);
      }
    },
    [setModalOpen, setModalCallback]
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
    company,

    // provider handling
    provider,
    setProvider,
    isProviderMissing,
    setIsProviderMissing,

    // modal
    isModalOpen,
    setModalOpen,
    closeModal,

    // wallet
    walletAddress,
    isWalletLoading,
    isConnected,

    // identity
    identity,
    isIdentityLoading,
    handlePurchaseIdentity,
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
    networkName,
    network,
    SupportedNetworks,
    switchNetwork,
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
