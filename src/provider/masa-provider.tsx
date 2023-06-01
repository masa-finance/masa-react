import React from 'react';
import { QueryClientProvider } from 'react-query';
import {
  MasaContextProvider,
  MasaContextProviderProps,
} from './masa-context-provider';

import { queryClient } from './masa-query-client';
import { MasaInterface } from '../components';
import ConfiguredRainbowKitProvider from './configured-rainbowkit-provider/configured-rainbowkit-provider';
import { MasaNetworks } from './configured-rainbowkit-provider/utils';

export const MasaProvider = ({
  children,
  chainsToUse,
  walletsToUse,
  rainbowKitModalSize,
  ...args
}: MasaContextProviderProps & {
  chainsToUse?: Array<keyof MasaNetworks>;
  walletsToUse?: ('metamask' | 'valora' | 'walletconnect')[];
  rainbowKitModalSize?: 'compact' | 'wide';
}): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <ConfiguredRainbowKitProvider
      chainsToUse={chainsToUse}
      walletsToUse={walletsToUse}
      rainbowKitModalSize={rainbowKitModalSize}
    >
      <MasaContextProvider {...args}>
        <div id="modal-mount" />
        <MasaInterface disableMetamask={args.useRainbowKitWalletConnect} />
        {children}
      </MasaContextProvider>
    </ConfiguredRainbowKitProvider>
  </QueryClientProvider>
);
