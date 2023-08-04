import React from 'react';
import { QueryClientProvider } from 'react-query';
import {
  MasaContextProvider,
  MasaContextProviderProps,
} from './masa-context-provider';

import { queryClient } from './masa-query-client';
import ConfiguredRainbowKitProvider from './configured-rainbowkit-provider/configured-rainbowkit-provider';
import { MasaInterface } from '../components';
import { MasaNetworks } from './configured-rainbowkit-provider/utils';
import MasaRefactorProvider from '../refactor/masa-provider';

export const MasaProvider = ({
  children,
  chainsToUse,
  walletsToUse,
  rainbowKitModalSize,
  contractAddressOverrides,
  soulNameStyle,
  ...args
}: MasaContextProviderProps & {
  chainsToUse?: Array<keyof MasaNetworks>;
  walletsToUse?: ('metamask' | 'valora' | 'walletconnect')[];
  rainbowKitModalSize?: 'compact' | 'wide';
  contractAddressOverrides?: {
    SoulNameAddress: string;
    SoulStoreAddress: string;
  };
}): JSX.Element => {
  const { forceNetwork, environmentName, company, verbose } = args;
  return (
    <QueryClientProvider contextSharing client={queryClient}>
      <ConfiguredRainbowKitProvider
        chainsToUse={chainsToUse}
        forceNetwork={forceNetwork}
        walletsToUse={walletsToUse}
        rainbowKitModalSize={rainbowKitModalSize}
      >
        <MasaRefactorProvider
          config={{
            company,
            verbose,
            allowedWallets: walletsToUse, // ['metamask', 'valora', 'walletconnect'],
            forceChain: forceNetwork,
            allowedNetworkNames: chainsToUse ?? [
              'goerli',
              'ethereum',
              'alfajores',
              'celo',
              'mumbai',
              'polygon',
              'bsctest',
              'bsc',
              'basegoerli',
              'unknown',
            ],
            contractAddressOverrides,
            soulNameStyle,
            masaConfig: {
              // networkName: 'ethereum',
              environment: environmentName ?? 'dev',
              // arweave: arweaveConfig,
            },
            rainbowkitConfig: {
              modalSize: rainbowKitModalSize ?? 'wide',
            },
          }}
        >
          <MasaContextProvider {...args}>
            <div id="modal-mount" />
            <MasaInterface hideLegacyModal={args.hideLegacyModal} disableMetamask={args.useRainbowKitWalletConnect} />
            {children}
          </MasaContextProvider>
        </MasaRefactorProvider>
      </ConfiguredRainbowKitProvider>
    </QueryClientProvider>
  );
};
