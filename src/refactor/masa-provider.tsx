import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MasaBaseProvider from './base-provider';
import { MasaReactConfig } from './config';
import WalletProvider from './wallet-client/wallet-client-provider';
import WagmiRainbowkitProvider from './wallet-client/wagmi-rainbowkit-provider';
import MasaClientProvider from './masa-client/masa-client-provider';

import { createQueryClient } from './masa-client/query-client';

export interface MasaProviderValue {}

export const MasaContext = createContext({} as MasaProviderValue);
export const QcContext = React.createContext<QueryClient | undefined>(
  undefined
);

// const queryClient = createQueryClient();

export const MasaProvider = ({
  children,
  config,
  verbose,
}: {
  children: ReactNode;
  config: MasaReactConfig;
  verbose?: boolean;
}) => {
  const masaProviderValue = useMemo(() => ({} as MasaProviderValue), []);
  const queryClient = useMemo(() => createQueryClient(), []);
  return (
    <MasaBaseProvider
      config={{ ...config, masaConfig: { ...config.masaConfig, verbose } }}
    >
      <QueryClientProvider client={queryClient} context={QcContext}>
        <WagmiRainbowkitProvider>
          <WalletProvider>
            <MasaClientProvider>
              <MasaContext.Provider value={masaProviderValue}>
                {children}
              </MasaContext.Provider>
            </MasaClientProvider>
          </WalletProvider>
        </WagmiRainbowkitProvider>
      </QueryClientProvider>
    </MasaBaseProvider>
  );
};

export const useMasa = (): MasaProviderValue => useContext(MasaContext);
export default MasaProvider;
