import './styles.scss';

import {
  MasaContextProvider,
  MasaContextProviderProps,
} from './masa-context-provider';
import React from 'react';
import { QueryClientProvider } from 'react-query';

import { queryClient } from './masa-query-client';
import { MasaInterface } from '../components';
import ConfiguredRainbowKitProvider from './configured-rainbowkit-provider/configured-rainbowkit-provider';

// needs to be imported using require. Otherwise, it will not load!
require('@rainbow-me/rainbowkit/styles.css');

export const MasaProvider = ({
  children,
  chainsToUse,
  walletsToUse,
  ...args
}: MasaContextProviderProps): JSX.Element => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConfiguredRainbowKitProvider chainsToUse={chainsToUse} walletsToUse={walletsToUse}>
          <MasaContextProvider {...args}>
            <div id="modal-mount" />
            <MasaInterface disableMetamask={args.useRainbowKitWalletConnect} />
            {children}
          </MasaContextProvider>
        </ConfiguredRainbowKitProvider>
      </QueryClientProvider>
    </>
  );
};
