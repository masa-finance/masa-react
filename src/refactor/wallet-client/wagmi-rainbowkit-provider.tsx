import {
  connectorsForWallets,
  RainbowKitProvider,
  WalletList,
} from '@rainbow-me/rainbowkit';

import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import type { ReactNode } from 'react';
import React, { useMemo } from 'react';

import { getRainbowkitChains } from './utils';
import { walletConnectorsList } from './constants';
import { useConfig } from '../base-provider';

export interface WagmiRainbowkitProviderProps {
  children: ReactNode;
}

export const WagmiRainbowkitProvider = ({
  children,
}: WagmiRainbowkitProviderProps) => {
  const { allowedNetworkNames, allowedWallets, rainbowkitConfig } = useConfig();
  const rainbowkitChains = useMemo(
    () => getRainbowkitChains(allowedNetworkNames),
    [allowedNetworkNames]
  );

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
    allowedWallets?.map((wallet: string) => {
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

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        modalSize={rainbowkitConfig?.modalSize}
        chains={rainbowkitChains}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WagmiRainbowkitProvider;
