import { MasaContextProvider, MasaContextProviderProps } from './masa-context';
import React from 'react';
import { QueryClientProvider } from 'react-query';

import { MasaInterface } from '../../components/masa-interface';
import { useMetamask } from './use-metamask';
import { queryClient } from './masa-query-client';

import '../../../styles.scss';

export const MasaProvider = ({
  children,
  ...rest
}: MasaContextProviderProps) => {
  useMetamask({ disable: rest.noWallet });

  return (
    <QueryClientProvider client={queryClient}>
      <MasaContextProvider {...rest}>
        <MasaInterface disable={rest.noWallet} />
        {children}
      </MasaContextProvider>
    </QueryClientProvider>
  );
};
