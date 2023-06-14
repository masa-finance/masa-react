import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useMasaClient } from './masa-client/use-masa-client';
import { useIdentity } from './masa-feature/use-identity';
import { useSession } from './masa-feature/use-session';

export interface MasaClientProviderValue {
  masa?: ReturnType<typeof useMasaClient>['sdk'];
  session?: ReturnType<typeof useSession>['session'];
  identity?: ReturnType<typeof useIdentity>['identity'];
}

export const MasaClientContext = createContext({} as MasaClientProviderValue);

export const MasaClientProvider = ({ children }: { children: ReactNode }) => {
  const { sdk: masa } = useMasaClient();
  const { session } = useSession();

  const masaClientProviderValue: MasaClientProviderValue = useMemo(
    () =>
      ({
        masa,

        session,
      } as MasaClientProviderValue),
    [masa, session]
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
