import type {
  EnvironmentName,
  MasaArgs,
  NetworkName,
} from '@masa-finance/masa-sdk';
import type { WagmiConfigProps } from 'wagmi';
import { CustomGallerySBT } from '../components/masa-interface/pages/gallery/gallery';

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
  wagmiConfig?: WagmiConfigProps;
  customSBTs?: CustomGallerySBT[];
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
  allowedNetworkNames: [
    'ethereum',
    'goerli',
    'alfajores',
    'celo',
    'mumbai',
    'polygon',
    'bsctest',
    'bsc',
    'basegoerli',
    'base',
  ],
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
