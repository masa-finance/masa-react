import React from 'react';
import {
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
import { BigNumber, Signer, Wallet } from 'ethers';
import { GetNetworkResult } from '@wagmi/core';
import { WrapperModalProps, ModalName } from '../components/new-modal';
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

  // general config
  scope?: string[];
  areScopesFullfiled?: boolean;
  company?: string;

  // provider
  provider?: Wallet | Signer;
  setProvider?: (provider?: Wallet | Signer) => void;

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

  // wallet
  walletAddress?: string;
  isWalletLoading?: boolean;
  hasWalletAddress?: boolean;

  // identity
  identity?: {
    identityId?: BigNumber;
    address?: string;
  };
  isIdentityLoading?: boolean;
  handlePurchaseIdentity?: () => Promise<boolean | undefined>;
  handlePurchaseIdentityWithSoulname?: (
    paymentMethod: PaymentMethod,
    soulname: string,
    registrationPrice: number
  ) => Promise<boolean>;
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

  // new-modal
  openModal?: ({
    name,
    title,
    wrapperProps,
    contentProps,
  }: {
    name: ModalName;
    title?: React.ReactNode;
    wrapperProps?: WrapperModalProps | undefined;
    contentProps: any;
  }) => void;

  openAuthenticateModal?: () => void;
  openConnectedModal?: () => void;
  openCreateCreditScoreModal?: () => void;
  openCreateIdentityModal?: () => void;
  openCreateSoulnameModal?: () => void;
  openSuccessCreateIdentityModal?: () => void;
  openSwitchChainModal?: () => void;
  openInterfaceMasaGreen?: () => void;
}
