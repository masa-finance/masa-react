import React, { ReactNode, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import {
  PersistQueryClientProvider,
  Persister,
} from '@tanstack/react-query-persist-client';
import MasaBaseProvider from './base-provider';
import { MasaReactConfig } from './config';

import { MasaStateProvider } from './provider/masa-state-provider';
import { MasaWalletProvider } from './provider/masa-wallet-provider';
import WagmiRainbowkitProvider from './wallet-client/wagmi-rainbowkit-provider';
import {
  persister,
  queryClient as queryClientSingleton,
} from './masa-client/query-client';

export interface MasaProviderValue {
  children?: ReactNode;
}

export const MasaProvider = ({
  children,
  config,
  verbose,
}: {
  children: ReactNode;
  config: MasaReactConfig;
  verbose?: boolean;
}) => {
  const [queryClient] = useState(queryClientSingleton);

  return (
    <WagmiRainbowkitProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: persister as Persister }}
      >
        <MasaBaseProvider
          config={{ ...config, masaConfig: { ...config.masaConfig, verbose } }}
        >
          <MasaWalletProvider>
            <MasaStateProvider>
              <NiceModal.Provider>{children}</NiceModal.Provider>
            </MasaStateProvider>
          </MasaWalletProvider>
        </MasaBaseProvider>
      </PersistQueryClientProvider>
    </WagmiRainbowkitProvider>
  );
};

export default MasaProvider;
