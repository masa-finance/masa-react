import React from 'react';
import { QueryClientProvider } from 'react-query';
import {
  MasaContextProvider,
  MasaContextProviderProps,
} from './masa-context-provider';

import { queryClient } from './masa-query-client';
import { MasaInterface } from '../components';
import ConfiguredRainbowKitProvider from './configured-rainbowkit-provider/configured-rainbowkit-provider';

export function MasaProvider({
  children,
  chainsToUse,
  walletsToUse,
  ...args
}: MasaContextProviderProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfiguredRainbowKitProvider
        chainsToUse={chainsToUse}
        walletsToUse={walletsToUse}
      >
        <MasaContextProvider {...args}>
          <div id="modal-mount" />
          <MasaInterface disableMetamask={args.useRainbowKitWalletConnect} />
          {children}
        </MasaContextProvider>
      </ConfiguredRainbowKitProvider>
    </QueryClientProvider>
  );
}
