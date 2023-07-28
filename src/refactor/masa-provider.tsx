import React, { ReactNode } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import MasaBaseProvider from './base-provider';
import { MasaReactConfig } from './config';

import { MasaStateProvider } from './provider/masa-state-provider';
import { MasaWalletProvider } from './provider/masa-wallet-provider';

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
}) => (
  <MasaBaseProvider
    config={{ ...config, masaConfig: { ...config.masaConfig, verbose } }}
  >
    <MasaWalletProvider>
      <MasaStateProvider>
        <NiceModal.Provider>{children}</NiceModal.Provider>
      </MasaStateProvider>
    </MasaWalletProvider>
  </MasaBaseProvider>
);

export default MasaProvider;
