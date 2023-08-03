import {
  // CreditScoreDetails,
  EnvironmentName,
  GenerateGreenResult,
  ICreditScore,
  IGreen,
  SoulNameDetails,
  // Masa,
  SupportedNetworks,
  VerifyGreenResult,
} from '@masa-finance/masa-sdk';
import React, { useCallback, useMemo } from 'react';
import type { BigNumber } from 'ethers';
import { CustomGallerySBT } from 'components/masa-interface/pages/gallery/gallery';
// import { createNewMasa } from '../helpers';
import {
  // useCreditScores,
  // useGreen,
  // useIdentity,
  useModal,
  // useNetwork,
  // useSession,
  // useSoulnames,
  // useWallet,
} from './modules';
import { MasaContext } from './masa-context';
import { MasaShape } from './masa-shape';
import { useScopes } from './modules/scopes/scopes';
import { useCustomGallerySBT, useCustomSBT } from './modules/custom-sbts';
import { useRainbowKit } from './use-rainbowkit';
// import { useWagmi } from './modules/wagmi';
// import { useNetworkSwitch } from './use-network-switch';

import { useLogout } from './hooks';
// import { useAccountState } from './use-account-state';
import { useSession as useSessionNew } from '../refactor/masa/use-session';
import { useGreen } from '../refactor/masa/use-green';
import { useSoulNames as useSoulNamesNew } from '../refactor/masa/use-soulnames';

import { useCreditScores as useCreditScoresNew } from '../refactor/masa/use-credit-scores';
import { useIdentity as useIdentityNew } from '../refactor/masa/use-identity';
import { useGreenGenerate } from '../refactor/masa/use-green-create';
import { useWallet as useWalletNew } from '../refactor/wallet-client/wallet/use-wallet';
import { useNetwork as useNetworkNew } from '../refactor/wallet-client/network/use-network';
import { useMasaClient } from '../refactor/masa-client/use-masa-client';
import { useIdentityPurchase } from '../refactor/masa/use-identity-purchase';
import { useCreditScoreCreate } from '../refactor/masa/use-credit-scores-create';
import { useSoulNamesPurchase } from '../refactor/masa/use-soulnames-purchase';
// import { useSoulNamesPurchase } from '../refactor/masa/use-soulnames-purchase';

export interface ArweaveConfig {
  port?: string;
  host?: string;
  protocol?: string;
  logging?: boolean;
}

export type EnvironmentNameEx = EnvironmentName & ('local' | 'stage');

export interface MasaContextProviderProps extends MasaShape {
  environmentName?: EnvironmentNameEx; // eslint-disable-line react/no-unused-prop-types
  arweaveConfig?: ArweaveConfig; // eslint-disable-line react/no-unused-prop-types
  customGallerySBT?: CustomGallerySBT[];
  fullScreenGallery?: boolean;
  // apiUrl?: string;
  useRainbowKitWalletConnect?: boolean;
  // noWallet?: boolean;
  // signer?: Signer;
  // chainsToUse?: Array<keyof MasaNetworks>;
  // walletsToUse?: string[];
  soulNameStyle?: string;
}

export const MasaContextProvider = ({
  children,
  // masa-react branding
  company,
  // use no wallet
  // signer used in masa instance
  // signer,
  // env used in masa instance
  // environmentName = 'dev' as EnvironmentNameEx,
  // arweaveConfig,
  // arweave config used in masa instance
  // verbose on /off
  verbose = false,
  // force specific network
  forceNetwork,
  // custom SBT render for gallery
  customGallerySBT,
  // render gallery in full screen
  fullScreenGallery,
  // api url override
  // apiUrl,

  useRainbowKitWalletConnect = false,
  soulNameStyle,
}: MasaContextProviderProps): JSX.Element => {
  // masa
  // const [masaInstance, setMasaInstance] = useState<Masa | undefined>();
  // const [signer, setSigner] = useState<Signer | undefined>();
  const { sdk: masaInstance } = useMasaClient();
  // wallet
  // const { isWalletLoading, reloadWallet } = useWallet(masaInstance, signer);

  const {
    address: accountAddress,
    isConnected,
    isDisconnected,
    openAccountModal,
    openChainModal,
    openConnectModal,
    hasAddress: hasWalletAddress,
    walletName,
    signer,
  } = useWalletNew();
  // const {
  //   // isConnected,
  //   // isDisconnected,
  //   // hasAccountAddress,
  //   // accountAddress,
  //   // walletName,
  // } = useAccountState({
  //   masa: masaInstance,
  //   walletAddress,
  //   signer,
  //   hasWalletAddress,
  //   reloadWallet,
  // });

  // session
  // const { isLoggedIn, handleLogin, handleLogout, isSessionLoading } =
  //   useSession(masaInstance, accountAddress);

  const { isLoggedIn, handleLogin, handleLogout, isSessionLoading } =
    useSessionNew();

  // network <-- used for metamask interation
  // const { currentNetwork, switchNetwork } = useNetwork({
  //   provider: signer,
  //   useRainbowKitWalletConnect,
  // });
  const {
    currentNetwork,
    currentNetworkNew,
    switchNetworkByName: switchNetworkNew,
    switchNetworkByName: switchNetwork,
    canProgramaticallySwitchNetwork,
  } = useNetworkNew();
  // const {
  //   // switchNetwork: switchNetworkNew,
  //   // currentNetwork: currentNetworkNew,
  //   // canProgramaticallySwitchNetwork,
  // } = useNetworkSwitch();

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
  const { identity, isIdentityLoading, reloadIdentity } = useIdentityNew();
  const { handlePurchaseIdentity, handlePurchaseIdentityWithSoulname } =
    useIdentityPurchase();

  // soul names
  const { soulnames, isSoulnamesLoading, reloadSoulnames } = useSoulNamesNew();
  const { purchaseSoulName } = useSoulNamesPurchase();

  // credit scores
  const { creditScores, isCreditScoresLoading, reloadCreditScores } =
    useCreditScoresNew();

  const { handleCreateCreditScore } = useCreditScoreCreate();
  // greens
  const { greens, isGreensLoading, reloadGreens } = useGreen();
  const { handleGenerateGreen, handleCreateGreen } = useGreenGenerate();
  // masaInstance,
  // accountAddress

  // scope
  const { scope, setScope, areScopesFullfiled } = useScopes(
    soulnames as SoulNameDetails[] | undefined,
    identity as
      | {
          identityId?: BigNumber | undefined;
          address: string;
        }
      | undefined,
    !!isLoggedIn,
    masaInstance?.config.verbose
  );

  // rainbowkit
  const {
    // openChainModal,
    // openConnectModal,
    // openAccountModal,
    setRainbowKitModalCallback,
  } = useRainbowKit();

  const { logout } = useLogout({
    onLogoutStart: handleLogout,
    onLogoutFinish: () =>
      console.log('finished logout', {
        accountAddress,
        openConnectModal,
        isLoggedIn,
      }),
    walletAddress: accountAddress,
    masa: masaInstance,
    signer,
  });

  // modal
  const {
    isModalOpen,
    setModalOpen,
    setModalCallback,
    modalCallback,
    closeModal,
    forcedPage,
    setForcedPage,
    openMintSoulnameModal,
    openMintMasaGreen,
    useModalSize,
    openGallery,
    modalSize,
  } = useModal(
    !!isLoggedIn,
    hasWalletAddress, // used to be hasWalletAddress
    areScopesFullfiled
  );

  // global loading flag
  const isLoading = useMemo(
    () =>
      !masaInstance ||
      // isWalletLoading ||
      isSessionLoading ||
      isIdentityLoading ||
      isSoulnamesLoading ||
      isCreditScoresLoading ||
      isGreensLoading, // wagmiLoading,
    [
      masaInstance,
      // isWalletLoading,
      isSessionLoading,
      isIdentityLoading,
      isSoulnamesLoading,
      isCreditScoresLoading,
      isGreensLoading,
      // wagmiLoading,
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

  // useEffect(() => {
  //   const loadMasa = (): void => {
  //     if (!signer) return;

  //     const masa: Masa | undefined = createNewMasa({
  //       signer,
  //       environmentName,
  //       networkName: currentNetwork?.networkName,
  //       arweaveConfig,
  //       verbose,
  //       apiUrl,
  //       contractAddressOverrides,
  //     });

  //     setMasaInstance(masa);
  //   };

  //   void loadMasa();
  // }, [arweaveConfig, environmentName, verbose, currentNetwork, signer, apiUrl]);

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
      modalCallback,

      // wallet
      walletAddress: accountAddress,
      // isWalletLoading,
      hasWalletAddress,
      accountAddress,
      hasAccountAddress: hasWalletAddress,
      // identity
      identity: identity as
        | {
            identityId?: BigNumber | undefined;
            address?: string | undefined;
          }
        | undefined,
      isIdentityLoading,
      handlePurchaseIdentity,
      handlePurchaseIdentityWithSoulname,
      reloadIdentity,

      // session
      isLoggedIn: !!isLoggedIn,
      isSessionLoading,
      handleLogin,
      handleLogout,

      // credit scores
      creditScores: creditScores as
        | {
            tokenId: BigNumber;
            tokenUri: string;
            metadata?: ICreditScore | undefined;
          }[]
        | undefined,
      isCreditScoresLoading,
      handleCreateCreditScore,
      reloadCreditScores,

      // soul names
      soulnames: soulnames as SoulNameDetails[] | undefined,
      isSoulnamesLoading,
      reloadSoulnames,
      soulNameStyle,
      purchaseSoulName,

      // greens
      greens: greens as
        | {
            tokenId: BigNumber;
            tokenUri: string;
            metadata?: IGreen | undefined;
          }[]
        | undefined,
      isGreensLoading,
      handleGenerateGreen: handleGenerateGreen as (
        phoneNumber: string
      ) => Promise<GenerateGreenResult | undefined>,
      handleCreateGreen: handleCreateGreen as (
        phoneNumber: string,
        code: string
      ) => Promise<VerifyGreenResult | undefined>,
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
    modalCallback,

    // wallet

    // isWalletLoading,
    hasWalletAddress,
    accountAddress,

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
    purchaseSoulName,
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
    soulNameStyle,

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
