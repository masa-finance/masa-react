import {
  connectorsForWallets,
  // getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

// Import known recommended wallets
import { Valora } from '@celo/rainbowkit-celo/wallets';
import { injectedWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
// Import CELO chain information
// import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';
// import {
//   baseGoerli,
//   bsc,
//   bscTestnet,
//   goerli,
//   mainnet,
//   polygon,
//   polygonMumbai,
// } from 'wagmi/chains';

import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import { getRainbowkitChains, MasaNetworks } from './utils';
// import { SupportedNetworks } from '@masa-finance/masa-sdk';

type ConfiguredRainbowKitProviderValue = Record<string, never>;

interface ConfiguredRainbowKitProviderProps {
  children: ReactNode;
  chainsToUse?: Array<keyof MasaNetworks>;
}

// const { chains, provider } = configureChains(
//   [
//     // eth
//     mainnet,
//     goerli,
//     // polygon
//     polygon,
//     polygonMumbai,
//     // base
//     baseGoerli,

//     // binance smart chain
//     bsc,
//     bscTestnet,
//     // celo
//     Alfajores,
//     Celo,
//   ],
//   [
//     // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
//     publicProvider(),
//     jsonRpcProvider({
//       rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
//     }),
//   ]
// );

// const { wallets } = getDefaultWallets({
//   appName: 'Masa React',
//   projectId: '04a4088bf7ff775c3de808412c291cc0',
//   chains,
// });

// const celoConnectors = connectorsForWallets([
//   {
//     groupName: 'Recommended',
//     wallets: [injectedWallet({ chains }), metaMaskWallet({ chains })],
//   },
//   {
//     groupName: 'Celo',
//     wallets: [
//       Valora({ chains }),
//       // CeloWallet({ chains }),
//       // CeloDance({ chains }),
//     ],
//   },
// ]);

// console.log(
//   'abyayayayo',
//   celoConnectors().map((cc) => cc.name)
// );

export const ConfiguredRainbowKitProvider = ({
  children,
  chainsToUse,
}: ConfiguredRainbowKitProviderProps) => {
  const rainbowkitChains = getRainbowkitChains(chainsToUse);
  const { chains, provider } = configureChains(rainbowkitChains, [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]);

  const celoConnectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [injectedWallet({ chains }), metaMaskWallet({ chains })],
    },
    {
      groupName: 'Celo',
      wallets: [Valora({ chains })],
    },
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: celoConnectors,
    provider,
  });

  const contextValue = useMemo(() => ({}), []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider modalSize="compact" chains={rainbowkitChains}>
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
