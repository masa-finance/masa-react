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
  useMasaModals,
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

  // provider
  const {
    provider: wagmiProvider,
    isLoading: wagmiLoading,
    signer: wagmiSigner,
  } = useWagmi();
  const [provider, setProvider] = useState<Wallet | Signer | undefined>(
    wagmiSigner as Signer | undefined
  );

  useEffect(() => setProvider(wagmiSigner as Signer), [wagmiSigner]);

  // wallet
  const { walletAddress, isWalletLoading, hasWalletAddress } = useWallet(
    masaInstance,
    wagmiSigner as Signer | undefined
  );
  // session
  const { isLoggedIn, handleLogin, handleLogout, isSessionLoading } =
    useSession(masaInstance, walletAddress);

  // network
  const { switchNetwork, currentNetwork } = useNetwork(wagmiSigner as Signer);
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
  console.log({ scope, areScopesFullfiled });
  // rainbowkit
  const {
    openChainModal,
    openConnectModal,
    openAccountModal,
    setRainbowKitModalCallback,
  } = useRainbowKit();

  // new-modal
  const {
    openAuthenticateModal,
    openConnectedModal,
    openCreateCreditScoreModal,
    openCreateIdentityModal,
    openCreateSoulnameModal,
    openSuccessCreateIdentityModal,
    openSwitchChainModal,
    openInterfaceMasaGreen,
  } = useMasaModals();

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

  const connect = useCallback(
    (options?: { scope?: string[]; callback?: () => void }) => {
      if (verbose) {
        console.info({ forcedPage });
      }

      // * feature toggle, to be removed soon
      if (useRainbowKitWalletConnect) {
        console.log('userainbow', openConnectModal);
        // * set the callback to open masa modal after rainbowkit modal is closed
        setRainbowKitModalCallback(() => {
          return () => setModalOpen(true);
        });

        openConnectModal?.();
      } else setModalOpen(true);

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
      // wagmiSigner,
    ]
  );

  useEffect(() => {
    const loadMasa = (): void => {
      // if (!provider) return;

      const masa: Masa | undefined = createNewMasa({
        // signer: provider,
        signer: wagmiSigner as Signer | null,
        // provider: wagmiProvider as providers.Provider,
        environmentName,
        networkName: currentNetwork?.networkName,
        arweaveConfig,
        verbose,
      });

      setMasaInstance(masa);
    };

    void loadMasa();
  }, [
    arweaveConfig,
    environmentName,
    verbose,
    currentNetwork,
    wagmiProvider,
    wagmiSigner,
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

    // wagmi
    switchNetworkNew,
    currentNetworkNew,

    // new-modal
    openAuthenticateModal,
    openConnectedModal,
    openCreateCreditScoreModal,
    openCreateIdentityModal,
    openCreateSoulnameModal,
    openSuccessCreateIdentityModal,
    openSwitchChainModal,
    openInterfaceMasaGreen
  };

  return (
    <MasaContext.Provider value={context}>{children}</MasaContext.Provider>
  );
};
