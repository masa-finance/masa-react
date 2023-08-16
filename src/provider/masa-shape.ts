import React from 'react';
import {
  CreateSoulNameResult,
  GenerateGreenResult,
  ICreditScore,
  IGreen,
  Masa,
  Network,
  NetworkName,
  PaymentMethod,
  SoulNameDetails,
  VerifyGreenResult,
} from '@masa-finance/masa-sdk';
import { BigNumber, Signer } from 'ethers';
import { GetNetworkResult } from '@wagmi/core';
import { CustomGallerySBT } from '../components/masa-interface/pages/gallery/gallery';

export interface MasaShape {
  children?: React.ReactNode;
  // masa
  masa?: Masa;
  // verbose flag
  verbose?: boolean;

  // global loading
  isLoading?: boolean;

  // global connect
  connect?: (options?: { scope?: string[]; callback?: () => void }) => void;
  logout?: () => Promise<boolean>;
  // general config
  scope?: string[];
  areScopesFullfiled?: boolean;
  company?: string;

  // provider
  signer?: Signer;
  setSigner?: (signer?: Signer) => void;

  // modal
  isModalOpen?: boolean;
  setModalOpen?: (val: boolean) => void;
  closeModal?: (forceCallback?: boolean) => void;
  forcedPage?: string | null;
  setForcedPage?: (page: string | null) => void;
  openMintSoulnameModal?: (callback?: () => void) => void;
  openMintMasaGreen?: (callback?: () => void) => void;
  modalSize?: { width: number; height: number } | null;
  useModalSize?: (size: { width: number; height: number }) => void;
  openGallery?: (callback?: () => void) => void;
  modalCallback?: (() => void) | null;
  hideLegacyModal?: boolean;

  // wallet
  walletAddress?: string;
  isWalletLoading?: boolean;
  hasWalletAddress?: boolean;
  accountAddress?: string;
  hasAccountAddress?: boolean;

  // identity
  identity?: {
    identityId?: BigNumber;
    address?: string;
  };
  isIdentityLoading?: boolean;
  handlePurchaseIdentity?: () => Promise<boolean | undefined | Error>;
  handlePurchaseIdentityWithSoulname?: (
    paymentMethod: PaymentMethod,
    soulname: string,
    registrationPeriod: number,
    style?: string
  ) => Promise<
    | ({ identityId?: string | BigNumber | undefined } & CreateSoulNameResult)
    | Error
    | undefined
  >;
  reloadIdentity?: () => void;

  // session
  isLoggedIn?: boolean;
  isSessionLoading?: boolean;
  handleLogin?: () => void;
  handleLogout?: (logoutCallback?: () => void) => Promise<void>;

  // credit scores
  creditScores?: {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: ICreditScore;
  }[];
  isCreditScoresLoading?: boolean;
  handleCreateCreditScore?: () => Promise<boolean | undefined>;
  reloadCreditScores?: () => void;

  // soul names
  soulnames?: SoulNameDetails[];
  isSoulnamesLoading?: boolean;
  reloadSoulnames?: () => void;
  soulNameStyle?: string;

  // greens
  greens?: {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: IGreen;
  }[];
  isGreensLoading?: boolean;
  handleGenerateGreen?: (
    phoneNumber: string
  ) => Promise<GenerateGreenResult | undefined>;
  handleCreateGreen?: (
    phoneNumber: string,
    code: string
  ) => Promise<VerifyGreenResult | undefined>;
  reloadGreens?: () => void;

  // network
  currentNetwork?: Network;
  SupportedNetworks?: Partial<{ [index in NetworkName]: Network }>;
  switchNetwork?: (networkName: NetworkName) => void;
  forceNetwork?: NetworkName;

  // gallery
  customGallerySBT?: CustomGallerySBT[];
  fullScreenGallery?: boolean;

  // customSBTs
  customSBTs?: unknown[];
  badges?: unknown[];
  handleAddSBT?: (isCollection: boolean, name: string, address: string) => void;
  refetchContracts?: () => void;
  isLoadingCustomSBTs?: boolean;
  walletName?: string | undefined;
  // rainbowkit
  useRainbowKit?: boolean;
  openConnectModal?: (() => void) | undefined;
  openChainModal?: (() => void) | undefined;
  openAccountModal?: (() => void) | undefined;
  setRainbowkKitModalCallback?: React.Dispatch<
    React.SetStateAction<
      ((modalOpen?: boolean | undefined) => void) | undefined
    >
  >;
  switchNetworkNew?: (forcedNetworkParam: NetworkName) => void;
  currentNetworkNew?: GetNetworkResult;
  canProgramaticallySwitchNetwork?: boolean;

  purchaseSoulName?: (
    soulname: string,
    registrationPeriod: number,
    paymentMethod: PaymentMethod,
    style?: string | undefined
  ) => Promise<
    CreateSoulNameResult | (Error & { code?: string | undefined }) | undefined
  >;
  isConnected?: boolean;
  isDisconnected?: boolean;

  openAuthenticateModal?: () => void;
  openConnectedModal?: () => void;
  openCreateCreditScoreModal?: () => void;
  openCreateIdentityModal?: () => void;
  openCreateSoulnameModal?: () => void;
  openSuccessCreateIdentityModal?: () => void;
  openSwitchChainModal?: () => void;
  openInterfaceMasaGreen?: () => void;
}
