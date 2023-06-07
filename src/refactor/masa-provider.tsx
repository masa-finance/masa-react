import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import MasaBaseProvider from './base-provider';
import { MasaReactConfig } from './config';
import WalletProvider from './wallet-client/wallet-provider';

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
    <MasaContext.Provider value={masaProviderValue}>
      <MasaBaseProvider config={config}>
        <WalletProvider>{children}</WalletProvider>
        {children}
      </MasaBaseProvider>
    </MasaContext.Provider>
  );
};

export const useMasa = (): MasaProviderValue => useContext(MasaContext);
export default MasaProvider;
