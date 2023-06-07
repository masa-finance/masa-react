import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { MasaReactConfig } from './config';

export const MasaBaseContext = createContext({} as MasaReactConfig);

export const MasaBaseProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: MasaReactConfig;
}) => {
  const masaBaseProviderValue: MasaReactConfig = useMemo(
    () =>
      ({
        ...config,
      } as MasaReactConfig),
    [config]
  );
  return (
    <MasaBaseContext.Provider value={masaBaseProviderValue}>
      {children}
    </MasaBaseContext.Provider>
  );
};

export const useConfig = (): MasaReactConfig => useContext(MasaBaseContext);
export default MasaBaseProvider;
