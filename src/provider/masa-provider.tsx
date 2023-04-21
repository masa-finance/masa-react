import {
  MasaContextProvider,
  MasaContextProviderProps,
} from './masa-context-provider';
import React from 'react';
import { QueryClientProvider } from 'react-query';

import { queryClient } from './masa-query-client';

import './styles.scss';
import { MasaInterface } from '../components';
import ConfiguredRainbowKitProvider from './configured-rainbowkit-provider';

export const MasaProvider = ({
  children,
  ...args
}: MasaContextProviderProps): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfiguredRainbowKitProvider>
        <MasaContextProvider {...args}>
          <MasaInterface disableMetamask={args.noWallet} />
          {children}
        </MasaContextProvider>
      </ConfiguredRainbowKitProvider>
    </QueryClientProvider>
  );
};
