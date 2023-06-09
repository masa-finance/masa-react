import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import MasaBaseProvider from './base-provider';
import { MasaReactConfig } from './config';
import WalletProvider from './wallet-client/wallet-client-provider';
import WagmiRainbowkitProvider from './wallet-client/wagmi-rainbowkit-provider';
import MasaClientProvider from './masa-client/masa-client-provider';

export interface MasaProviderValue {}

export const MasaContext = createContext({} as MasaProviderValue);

export const MasaProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: MasaReactConfig;
}) => {
  const masaProviderValue = useMemo(() => ({} as MasaProviderValue), []);

  return (
    <MasaBaseProvider config={config}>
      <WagmiRainbowkitProvider>
        <WalletProvider>
          <MasaClientProvider>
            <MasaContext.Provider value={masaProviderValue}>
              {children}
            </MasaContext.Provider>
          </MasaClientProvider>
        </WalletProvider>
      </WagmiRainbowkitProvider>
    </MasaBaseProvider>
  );
};

export const useMasa = (): MasaProviderValue => useContext(MasaContext);
export default MasaProvider;
