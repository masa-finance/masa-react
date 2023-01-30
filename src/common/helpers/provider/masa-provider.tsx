import { MasaContextProvider, MasaContextProviderProps } from './masa-context';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { MasaInterface } from '../../components/masa-interface';
import { useMetamask } from './use-metamask';
import '../../../../styles.scss';

export const queryClient = new QueryClient();

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
