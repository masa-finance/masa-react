import React from 'react';
import {
  GenerateGreenResult,
  ICreditScore,
  IGreen,
  Masa,
  NetworkName,
  PaymentMethod,
  SoulNameDetails,
  VerifyGreenResult,
} from '@masa-finance/masa-sdk';
import { BigNumber, ethers } from 'ethers';
import { Network } from '../helpers';

export interface MasaShape {
  children?: React.ReactNode;

  // masa
  masa?: Masa;
  // global loading
  isLoading?: boolean;

  // global connect
  connect?: (options?: { scope?: string[]; callback?: () => void }) => void;

  // general config
  scope?: string[];
  areScopesFullfiled?: boolean;
  company?: string;

  // provider
  provider?: ethers.Wallet | ethers.Signer;
  setProvider?: (provider?: ethers.Wallet | ethers.Signer) => void;

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
  isConnected?: boolean;

  // identity
  identity?: {
    identityId?: BigNumber;
    address?: string;
  };
  isIdentityLoading?: boolean;
  handlePurchaseIdentity?: () => void;
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
  handleLogout?: (logoutCallback?: () => void) => void;

  // credit scores
  creditScores?:
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: ICreditScore | undefined;
      }[];
  isCreditScoresLoading?: boolean;
  handleCreateCreditScore?: () => void;
  reloadCreditScores?: () => void;

  // soul names
  soulnames?: SoulNameDetails[];
  isSoulnamesLoading?: boolean;
  reloadSoulnames?: () => void;

  // greens
  greens?:
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: IGreen;
      }[]
    | undefined;
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
