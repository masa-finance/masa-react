import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import type { Masa } from '@masa-finance/masa-sdk';
import { useMasaClient } from './masa-client';

export interface MasaClientProviderValue {
  masa?: Masa;
}

export const MasaClientContext = createContext({} as MasaClientProviderValue);

export const MasaClientProvider = ({ children }: { children: ReactNode }) => {
  const masa = useMasaClient();

  const masaClientProviderValue = useMemo(
    () => ({
      masa,
    }),
    [masa]
  );
  return (
    <MasaClientContext.Provider value={masaClientProviderValue}>
      {children}
    </MasaClientContext.Provider>
  );
};

export const useMasaClientProvider = (): MasaClientProviderValue =>
  useContext(MasaClientContext);
export default MasaClientProvider;
