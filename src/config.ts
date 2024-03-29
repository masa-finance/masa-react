import {
  EnvironmentName,
  MasaArgs,
  NetworkName,
  SupportedNetworks,
} from '@masa-finance/masa-sdk';
import type { WagmiConfigProps } from 'wagmi';

export const AllNetworks: NetworkName[] = Object.keys(SupportedNetworks).filter(
  (networkName: string) => networkName === 'unknown'
) as NetworkName[];

export interface ArweaveConfig {
  port?: string;
  host?: string;
  protocol?: string;
  logging?: boolean;
}

export type AllowedWallets =
  // recommended
  | 'metamask'
  | 'core'
  // celo
  | 'valora'
  // wallet connect
  | 'walletconnect';

export interface MasaReactConfig {
  company?: string;
  allowedNetworkNames?: NetworkName[];
  allowedWallets?: Array<AllowedWallets>;
  arweaveConfig?: ArweaveConfig;
  forceChain?: NetworkName;
  soulNameStyle?: string;
  verbose?: boolean;
  wagmiConfig?: WagmiConfigProps;
  contractAddressOverrides?: {
    SoulNameAddress: string;
    SoulStoreAddress: string;
  };
  rainbowkitConfig?: {
    modalSize: 'compact' | 'wide';
  };
  masaConfig: Omit<MasaArgs, 'signer'>;
}

export const defaultConfig: Partial<MasaReactConfig> = {
  company: 'Masa',
  allowedNetworkNames: AllNetworks,
  allowedWallets: ['metamask', 'valora', 'walletconnect', 'core'],
  masaConfig: {
    environment: 'production' as EnvironmentName,
    networkName: 'ethereum' as NetworkName,
    verbose: false,
    arweave: {
      host: 'arweave.net',
      port: Number.parseInt('443', 10),
      protocol: 'https',
      logging: false,
    },
  },
};

export const mergeConfigWithDefault = (config: Partial<MasaReactConfig>) =>
  ({
    ...defaultConfig,
    ...config,
    masaConfig: {
      ...defaultConfig.masaConfig,
      ...config.masaConfig,
    },
  }) as MasaReactConfig;
