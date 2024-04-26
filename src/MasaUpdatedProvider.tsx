import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import * as all from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { SupportedNetworks } from '@masa-finance/masa-sdk';
import { arbitrumNova } from '@wagmi/chains';
import {
  masaChain,
  masaTestnetChain,
} from './wallet-client/helpers/get-masa-chains';

const {
  goerli,
  sepolia,
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
  mainnet: ethereum,

  polygon,
} = all;

console.log({ all, SupportedNetworks });

const test = Object.values(SupportedNetworks).map((sn) => sn.networkName);
const secondOne = test.map((sn) => all[sn]);
console.log({ test, secondOne });
const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    masaChain,
    masaTestnetChain,
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
const client = new QueryClient();

console.log({ masaChain });

const MasaUpdatedProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>{children} </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default MasaUpdatedProvider;
