import {
  connectorsForWallets,
  RainbowKitProvider,
  WalletList,
  Wallet,
} from '@rainbow-me/rainbowkit';

// Import known recommended wallets
import { Valora } from '@celo/rainbowkit-celo/wallets';
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
// import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import { getRainbowkitChains, MasaNetworks } from './utils';

type ConfiguredRainbowKitProviderValue = Record<string, never>;

export const ConfiguredRainbowKitContext = createContext(
  {} as ConfiguredRainbowKitProviderValue
);

export interface ConfiguredRainbowKitProviderProps {
  children: ReactNode;
  chainsToUse?: Array<keyof MasaNetworks>;
  walletsToUse?: string[];
  rainbowKitModalSize?: 'compact' | 'wide';
}

const PROJECT_ID = '04a4088bf7ff775c3de808412c291cc0';

const walletConnectorsList: Record<
  string,
  (chains: Chain[]) => { groupName: string; wallets: Wallet[] }
> = {
  metamask: (chains: Chain[]) => ({
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains, projectId: PROJECT_ID }),
    ],
  }),
  valora: (chains: Chain[]) => ({
    groupName: 'Celo',
    wallets: [Valora({ chains, projectId: PROJECT_ID })],
  }),

  walletconnect: (chains: Chain[]) => ({
    groupName: 'WalletConnect',
    wallets: [
      walletConnectWallet({
        projectId: PROJECT_ID,
        chains,
        options: {
          qrcode: true,
          projectId: PROJECT_ID,
        },
      }),
    ],
  }),
};

export const ConfiguredRainbowKitProvider = ({
  children,
  chainsToUse,
  walletsToUse = ['metamask'],
  rainbowKitModalSize = 'compact',
}: ConfiguredRainbowKitProviderProps) => {
  const rainbowkitChains = getRainbowkitChains(chainsToUse);
  const { chains, provider, webSocketProvider } = configureChains(
    rainbowkitChains,
    [
      // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      publicProvider(),
      jsonRpcProvider({
        rpc: (chain: Chain) => ({ http: chain.rpcUrls.default.http[0] }),
      }),
    ]
  );

  const walletConnectors =
    walletsToUse?.map((wallet: string) => {
      if (walletConnectorsList[wallet]) {
        const walletListFunc = walletConnectorsList[wallet];
        return walletListFunc(chains) as unknown as WalletList;
      }
      return undefined;
    }) ?? [];

  const celoConnectors = connectorsForWallets(
    walletConnectors as unknown as WalletList
  );

  const wagmiClient = createClient({
    autoConnect: true,
    connectors: celoConnectors,
    provider,
    webSocketProvider,
  });

  const contextValue = useMemo(() => ({}), []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        modalSize={rainbowKitModalSize}
        chains={rainbowkitChains}
      >
        <ConfiguredRainbowKitContext.Provider value={contextValue}>
          {children}
        </ConfiguredRainbowKitContext.Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export const useConfiguredRainbowKit = (): ConfiguredRainbowKitProviderValue =>
  useContext(ConfiguredRainbowKitContext);

export default ConfiguredRainbowKitProvider;
