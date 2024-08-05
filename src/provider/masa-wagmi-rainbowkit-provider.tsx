import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';
import { Config, WagmiProvider } from 'wagmi';
import * as allChains from 'wagmi/chains';

// TODO: Consider importing the client from `masa-client/query-client`
const client = new QueryClient();

// Init with some sample chains
const {
  mainnet: ethereum,
  goerli,
  polygon,
  bsc,
  bscTestnet,
  opBNB,
  opBNBTestnet,
  polygonAmoy,
  polygonMumbai,
  celo,
  celoAlfajores,
  base,
  baseGoerli,
  baseSepolia,
  scroll,
  scrollSepolia,
} = allChains;

const config: Config = getDefaultConfig({
  appName: 'Masa App',
  projectId: 'masa-app',
  chains: [
    ethereum,
    goerli,
    polygon,
    bsc,
    bscTestnet,
    opBNB,
    opBNBTestnet,
    polygonAmoy,
    polygonMumbai,
    celo,
    celoAlfajores,
    base,
    baseGoerli,
    baseSepolia,
    scroll,
    scrollSepolia,
  ],
  ssr: true,
});

const MasaWagmiRainbowkitProvider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default MasaWagmiRainbowkitProvider;
