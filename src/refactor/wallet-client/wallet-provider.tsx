import {
  connectorsForWallets,
  RainbowKitProvider,
  WalletList,
} from '@rainbow-me/rainbowkit';

import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import { getRainbowkitChains } from './utils';
import { walletConnectorsList } from './constants';
import { useConfig } from '../base-provider';
import { useWalletClient } from './wallet-client';
import { useAccountChangeListen } from './account-change';

type WalletProviderValue = ReturnType<typeof useWalletClient>;

export const WalletContext = createContext({} as WalletProviderValue);

export interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { allowedNetworkNames, allowedWallets, rainbowkitConfig } = useConfig();

  const rainbowkitChains = getRainbowkitChains(allowedNetworkNames);
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

  const wallet = useWalletClient();
  useAccountChangeListen({
    onAccountChange: () => console.log('account changed'),
    onChainChange: () => console.log('chain changed'),
  });
  const walletProviderValue = useMemo(
    () =>
      ({
        ...wallet,
      } as WalletProviderValue),
    [wallet]
  );

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        modalSize={rainbowkitConfig?.modalSize}
        chains={rainbowkitChains}
      >
        <WalletContext.Provider value={walletProviderValue}>
          {children}
        </WalletContext.Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export const useWallet = (): WalletProviderValue => useContext(WalletContext);

export default WalletProvider;
