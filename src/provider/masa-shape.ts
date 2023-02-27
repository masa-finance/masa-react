import React from 'react';
import {
  GenerateGreenResult,
  ICreditScore,
  IGreen,
  Masa,
  NetworkName,
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
  company?: string;

  // provider
  provider?: ethers.Wallet | ethers.Signer;
  setProvider?: (provider?: ethers.Wallet | ethers.Signer) => void;

  // modal
  isModalOpen?: boolean;
  setModalOpen?: (val: boolean) => void;
  closeModal?: () => void;

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
  network?: ethers.providers.Network;
  SupportedNetworks?: Partial<{ [index in NetworkName]: Network }>;
  switchNetwork?: (chainId: number) => void;
}
