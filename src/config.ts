import type {
  EnvironmentName,
  MasaArgs,
  NetworkName,
} from '@masa-finance/masa-sdk';
import type { CreateConfigParameters } from 'wagmi';

export const AllNetworks: NetworkName[] = [
  // eth
  'goerli',
  'sepolia',
  'ethereum',
  // celo
  'alfajores',
  'celo',
  // polygon
  'mumbai',
  'polygon',
  // bsc
  'bsctest',
  'bsc',
  // opbnb
  'opbnbtest',
  'opbnb',
  // base
  'basegoerli',
  'basesepolia',
  'base',
  // scroll
  'scrollsepolia',
  'scroll',
];

export interface ArweaveConfig {
  port?: string;
  host?: string;
  protocol?: string;
  logging?: boolean;
}

export interface MasaReactConfig {
  company?: string;
  allowedNetworkNames?: NetworkName[];
  allowedWallets?: Array<'metamask' | 'valora' | 'walletconnect'>;
  arweaveConfig?: ArweaveConfig;
  forceChain?: NetworkName;
  soulNameStyle?: string;
  verbose?: boolean;
  wagmiConfig?: CreateConfigParameters;
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
  allowedWallets: ['metamask', 'valora', 'walletconnect'],
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
