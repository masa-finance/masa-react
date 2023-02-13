import {
  MasaContextProvider,
  MasaContextProviderProps,
} from './masa-context-provider';
import React from 'react';
import { QueryClientProvider } from 'react-query';

import { useMetamask } from './use-metamask';
import { queryClient } from './masa-query-client';

import '../../styles.scss';
import { MasaInterface } from '../components';

export const MasaProvider = ({
  children,
  ...args
}: MasaContextProviderProps): JSX.Element => {
  useMetamask({ disable: args.noWallet });

  return (
    <QueryClientProvider client={queryClient}>
      <MasaContextProvider {...args}>
        <MasaInterface disable={args.noWallet} />
        {children}
      </MasaContextProvider>
    </QueryClientProvider>
  );
};
