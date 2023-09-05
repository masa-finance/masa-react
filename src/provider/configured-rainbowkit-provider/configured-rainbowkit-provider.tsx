import {
  connectorsForWallets,
  RainbowKitProvider,
  Wallet,
  WalletList,
} from '@rainbow-me/rainbowkit';

import { Valora } from '@celo/rainbowkit-celo/wallets';
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import type { Chain } from 'wagmi';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import { NetworkName, SupportedNetworks } from '@masa-finance/masa-sdk';

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
  forceNetwork?: NetworkName;
}

const PROJECT_ID = '04a4088bf7ff775c3de808412c291cc0';

const walletConnectorsList: Record<
  string,
  (chains: Chain[]) => {
    groupName: string;
    wallets: Wallet[];
  }
> = {
  metamask: (chains: Chain[]) => ({
    groupName: 'Recommended',
    wallets: [
      injectedWallet({
        chains,
      }),
      metaMaskWallet({
        chains,
        walletConnectVersion: '2',
        projectId: PROJECT_ID,
      }),
    ],
  }),

  valora: (chains: Chain[]) => ({
    groupName: 'Celo',
    wallets: [
      Valora({
        chains,
        projectId: PROJECT_ID,
      }),
    ],
  }),

  walletconnect: (chains: Chain[]) => ({
    groupName: 'WalletConnect',
    wallets: [
      walletConnectWallet({
        projectId: PROJECT_ID,
        chains,
        version: '2',
        options: {
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
  forceNetwork,
}: ConfiguredRainbowKitProviderProps) => {
  const rainbowkitChains = getRainbowkitChains(chainsToUse);
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    rainbowkitChains,
    [
      // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      publicProvider(),
      jsonRpcProvider({
        rpc: (chain: Chain) => ({
          http: chain.rpcUrls.default.http[0],
        }),
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

  const wagmiClient = createConfig({
    autoConnect: true,
    connectors: celoConnectors,
    publicClient,
    webSocketPublicClient,
  });

  const contextValue = useMemo(() => ({}), []);

  return (
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider
        modalSize={rainbowKitModalSize}
        chains={rainbowkitChains}
        initialChain={SupportedNetworks[forceNetwork || 'unknown']?.chainId}
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
