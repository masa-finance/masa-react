import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useAsync } from 'react-use';
import { useMasaClient } from './masa-client/use-masa-client';
import { useIdentity } from './masa-feature/use-identity';

import { useWallet } from './wallet-client/wallet/use-wallet';
import { useSession } from './masa-feature/use-session';

export interface MasaClientProviderValue {
  masa?: ReturnType<typeof useMasaClient>['sdk'];
  session?: ReturnType<typeof useSession>['session'];
  identity?: ReturnType<typeof useIdentity>['identity'];
}

export const MasaClientContext = createContext({} as MasaClientProviderValue);

export const MasaClientProvider = ({ children }: { children: ReactNode }) => {
  const { masa, masaAddress } = useMasaClient();
  const {
    session,
    isLoadingSession,
    hasSession,
    loginSession,
    logoutSession,
    sessionAddress,
  } = useSession();
  const { isDisconnected } = useWallet();
  const { identity } = useIdentity();
  // * useEffect to handle account switches and disconnect
  useAsync(async () => {
    if (isLoadingSession) return;

    if (
      session &&
      masaAddress &&
      masaAddress === session?.user.address &&
      hasSession
    ) {
      return;
    }

    if (isDisconnected) {
      await logoutSession();
      return;
    }

    if (
      hasSession &&
      sessionAddress &&
      masaAddress &&
      sessionAddress !== masaAddress
    ) {
      await logoutSession();
    }
  }, [
    isLoadingSession,
    sessionAddress,
    masaAddress,
    isDisconnected,
    logoutSession,
    hasSession,
    session,
  ]);

  const masaClientProviderValue: MasaClientProviderValue = useMemo(
    () =>
      ({
        masa,
        session,
        sessionAddress,
        loginSession,
        logoutSession,
        identity,
      } as MasaClientProviderValue),
    [masa, session, identity, sessionAddress, loginSession, logoutSession]
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
