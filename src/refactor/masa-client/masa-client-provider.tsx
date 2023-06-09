import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useMasaClient } from './masa-client';

export interface MasaClientProviderValue {
  masa?: ReturnType<typeof useMasaClient>['sdk'];
}

export const MasaClientContext = createContext({} as MasaClientProviderValue);

export const MasaClientProvider = ({ children }: { children: ReactNode }) => {
  const { sdk: masa } = useMasaClient();

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
