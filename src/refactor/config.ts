import type { MasaArgs, NetworkName } from '@masa-finance/masa-sdk';

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

  wagmiConfig?: unknown;

  rainbowkitConfig?: {
    modalSize: 'compact' | 'wide';
  };

  masaConfig: Omit<MasaArgs, 'signer'>;
}
