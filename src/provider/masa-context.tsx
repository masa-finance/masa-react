import React, { createContext } from 'react';
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

export const MASA_CONTEXT = createContext<MasaShape>({});

export interface MasaShape {
  children?: React.ReactNode;
  setProvider?: (provider: ethers.Wallet | ethers.Signer | null) => void;
  provider?: ethers.Wallet | ethers.Signer | null;
  isModalOpen?: boolean;
  setModalOpen?: (val: boolean) => void;
  masa?: Masa;
  isConnected?: boolean;
  loading?: boolean;
  walletAddress?: string | undefined;
  identity?: {
    identityId?: BigNumber | undefined;
    address?: string | undefined;
  };
  loggedIn?: boolean;
  handleLogin?: () => void;
  handleLogout?: (callback?: () => void) => void;
  handlePurchaseIdentity?: () => void;
  connect?: (options?: { scope?: string[]; callback?: () => void }) => void;
  closeModal?: () => void;
  scope?: string[];
  company?: string;
  handleCreateCreditScore?: () => void;
  creditScores?:
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: ICreditScore | undefined;
      }[]
    | null;
  loadCreditScores?: () => void;
  soulnames?: SoulNameDetails[] | null;
  loadSoulnames?: () => void;
  logginLoading?: boolean;
  missingProvider?: boolean;
  setMissingProvider?: (value: boolean) => void;
  greens?:
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: IGreen | undefined;
      }[]
    | undefined;
  greenLoading?: boolean;
  handleCreateGreen?: (
    phoneNumber: string,
    code: string
  ) => Promise<VerifyGreenResult | undefined>;
  handleGenerateGreen?: (
    phoneNumber: string
  ) => Promise<GenerateGreenResult | undefined>;
  chain?: null | ethers.providers.Network;
  switchNetwork?: (chainId: number) => void;
  SupportedNetworks?: { [index in NetworkName]: Network };
  network?: string;
}
