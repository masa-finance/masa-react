import React from 'react';
import { QueryClientProvider } from 'react-query';
import {
  MasaContextProvider,
  MasaContextProviderProps,
} from './masa-context-provider';

import { queryClient } from './masa-query-client';
// import ConfiguredRainbowKitProvider from './configured-rainbowkit-provider/configured-rainbowkit-provider';
import { MasaInterface } from '../components';
import { MasaNetworks } from './configured-rainbowkit-provider/utils';
import MasaRefactorProvider from '../refactor/masa-provider';

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
  <QueryClientProvider contextSharing client={queryClient}>
    {/* //   <ConfiguredRainbowKitProvider
  //     chainsToUse={chainsToUse}
  //     walletsToUse={walletsToUse}
  //     rainbowKitModalSize={rainbowKitModalSize}
  //   > */}
    <MasaRefactorProvider
      config={{
        masaConfig: {},
      }}
    >
      <MasaContextProvider {...args}>
        <div id="modal-mount" />
        <MasaInterface disableMetamask={args.useRainbowKitWalletConnect} />
        {children}
      </MasaContextProvider>
    </MasaRefactorProvider>
  </QueryClientProvider>
  //   </ConfiguredRainbowKitProvider>
);
