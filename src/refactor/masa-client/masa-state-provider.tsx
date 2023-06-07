import React, { ReactNode, createContext, useContext, useMemo } from 'react';

export interface MasaProviderValue {}

export const MasaContext = createContext({} as MasaProviderValue);

export const MasaProvider = ({ children }: { children: ReactNode }) => {
  const MasaProviderValue = useMemo(() => ({}), []);
  return (
    <MasaContext.Provider value={MasaProviderValue}>
      {children}
    </MasaContext.Provider>
  );
};

export const useMasa = (): MasaProviderValue => useContext(MasaContext);
export default MasaProvider;
