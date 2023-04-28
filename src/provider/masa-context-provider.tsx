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
import { CustomGallerySBT } from 'components/masa-interface/pages/gallery/gallery';
import { useCustomSBT, useCustomGallerySBT } from './modules/custom-sbts';

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
  customGallerySBT?: CustomGallerySBT[];
  fullScreenGallery?: boolean;
  apiUrl?: string;
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
  // custom SBT render for gallery
  customGallerySBT,
  // render gallery in full screen
  fullScreenGallery,
  // api url override
  apiUrl,
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
  } = useModal(isLoggedIn, hasWalletAddress, areScopesFullfiled);

  // custom SBTs
  const { customContracts, handleAddSBT } = useCustomGallerySBT(
    masaInstance,
    customGallerySBT
  );
  const { customSBTs, badges } = useCustomSBT(masaInstance, customContracts);

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

      setModalOpen(true);
      setForcedPage?.(null);

      if (options?.scope) {
        setScope(options.scope);
      }

      if (typeof options?.callback === 'function') {
        setModalCallback(() => options?.callback);
      }
    },
    [
      setModalOpen,
      setModalCallback,
      setScope,
      setForcedPage,
      forcedPage,
      verbose,
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
        apiUrl,
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
    openGallery,
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

    // gallery
    customGallerySBT,
    fullScreenGallery,
    // custom SBTs
    customSBTs,
    badges,
    handleAddSBT,
  };

  return (
    <MasaContext.Provider value={context}>{children}</MasaContext.Provider>
  );
};
