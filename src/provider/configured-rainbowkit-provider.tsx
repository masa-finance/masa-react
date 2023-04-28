import {
  getDefaultWallets,
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

// Import known recommended wallets
import {
  Valora,
  // CeloWallet,
  //  CeloDance
} from '@celo/rainbowkit-celo/wallets';

// Import CELO chain information
import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';

import { configureChains, createClient, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  polygonMumbai,
  goerli,
  bsc,
  bscTestnet,
  baseGoerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

type ConfiguredRainbowKitProviderValue = Record<string, never>;

interface ConfiguredRainbowKitProviderProps {
  children: ReactNode;
}

const { chains, provider } = configureChains(
  [
    mainnet,
    polygon,
    polygonMumbai,
    goerli,
    baseGoerli,
    // celo,
    // celoAlfajores,
    bsc,
    bscTestnet,
    Alfajores,
    Celo,
  ],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'Masa React',
  projectId: '04a4088bf7ff775c3de808412c291cc0',
  chains,
});

const celoConnectors = connectorsForWallets([
  { ...wallets[0] },
  {
    groupName: 'Celo',
    wallets: [
      Valora({ chains }),
      // CeloWallet({ chains }),
      // CeloDance({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: celoConnectors,
  provider,
});

export const ConfiguredRainbowKitProvider = ({
  children,
}: ConfiguredRainbowKitProviderProps) => {
  const contextValue = useMemo(() => ({}), []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <ConfiguredRainbowKitContext.Provider value={contextValue}>
          {children}
        </ConfiguredRainbowKitContext.Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export const ConfiguredRainbowKitContext = createContext(
  {} as ConfiguredRainbowKitProviderValue
);

export const useConfiguredRainbowKit = (): ConfiguredRainbowKitProviderValue =>
  useContext(ConfiguredRainbowKitContext);

export default ConfiguredRainbowKitProvider;
