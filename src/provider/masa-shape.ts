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
  SoulNameErrorCodes,
  VerifyGreenResult,
} from '@masa-finance/masa-sdk';
import { BigNumber, Signer, Wallet } from 'ethers';

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
  SoulNameErrorCodes;

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
}
