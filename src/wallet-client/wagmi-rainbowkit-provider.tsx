// import {
//   // connectorsForWallets,
//   // WalletList,
//   RainbowKitProvider,
// } from '@rainbow-me/rainbowkit';

import {
  createConfig,
  http,
  CreateConfigParameters,
  WagmiProvider,
} from 'wagmi';

import { type Chain } from 'viem';
import type { ReactNode } from 'react';
import React, { useMemo } from 'react';

import { Transport } from 'viem';
import { getChainsSortedByForcedNetwork, getRainbowkitChains } from './utils';
import { useConfig } from '../base-provider';

export interface WagmiRainbowkitProviderProps {
  children: ReactNode;
}

export const WagmiRainbowkitProvider = ({
  children,
}: WagmiRainbowkitProviderProps) => {
  const { allowedNetworkNames, rainbowkitConfig, forceChain } = useConfig();
  const rainbowkitChains = useMemo(
    () =>
      getChainsSortedByForcedNetwork(
        getRainbowkitChains(allowedNetworkNames),
        forceChain
      ),
    [allowedNetworkNames, forceChain]
  );

  console.log({ rainbowkitChains });

  const newConfig: CreateConfigParameters = {
    chains: rainbowkitChains,
    transports: rainbowkitChains.reduce(
      (acc: Record<Chain['id'], Transport>, val: Chain) => {
        const { id } = val;
        acc[id] = http();
        return acc;
      },
      {} as Record<Chain['id'], Transport>
    ),
  };

  console.log({ newConfig });

  const wagmiConfig = createConfig(newConfig);

  return (
    <WagmiProvider config={wagmiConfig}>
      {/* <RainbowKitProvider modalSize={rainbowkitConfig?.modalSize}>
      </RainbowKitProvider> */}
      {children}
    </WagmiProvider>
  );
};

export default WagmiRainbowkitProvider;
