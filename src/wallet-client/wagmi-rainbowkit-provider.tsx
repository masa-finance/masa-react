import {
  connectorsForWallets,
  RainbowKitProvider,
  WalletList,
} from '@rainbow-me/rainbowkit';

import { Chain, configureChains, createConfig, WagmiConfig } from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import type { ReactNode } from 'react';
import React, { useMemo } from 'react';

import { getChainsSortedByForcedNetwork, getRainbowkitChains } from './utils';
import { walletConnectorsList } from './constants';
import { useConfig } from '../base-provider';

export interface WagmiRainbowkitProviderProps {
  children: ReactNode;
}

export const WagmiRainbowkitProvider = ({
  children,
}: WagmiRainbowkitProviderProps) => {
  const { allowedNetworkNames, allowedWallets, rainbowkitConfig, forceChain } =
    useConfig();
  const rainbowkitChains = useMemo(
    () =>
      getChainsSortedByForcedNetwork(
        getRainbowkitChains(allowedNetworkNames),
        forceChain
      ),
    [allowedNetworkNames, forceChain]
  );

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    rainbowkitChains,
    [
      publicProvider(),
      jsonRpcProvider({
        rpc: (chain: Chain) => ({ http: chain.rpcUrls.default.http[0] }),
      }),
    ]
  );

  const walletConnectors =
    allowedWallets?.map((wallet: 'metamask' | 'valora' | 'walletconnect') => {
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

  return (
    <WagmiConfig config={wagmiClient}>
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
