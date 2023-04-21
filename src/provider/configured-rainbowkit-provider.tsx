import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

interface ConfiguredRainbowKitProviderValue {
  [key: string]: any;
}

interface ConfiguredRainbowKitProviderProps {
  children: ReactNode;
}

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: '04a4088bf7ff775c3de808412c291cc0',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
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
