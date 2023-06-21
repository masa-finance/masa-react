import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useMasaClient } from './masa-client/use-masa-client';
import { useIdentity } from './masa/use-identity';

import { useSession } from './masa/use-session';
import { useCreditScores } from './masa/use-credit-scores';
import { useSoulNames } from './masa/use-soulnames';
import { useSessionListen } from './masa/use-session-listen';

export interface MasaClientProviderValue {
  masa?: ReturnType<typeof useMasaClient>['sdk'];
  session?: ReturnType<typeof useSession>['session'];
  identity?: ReturnType<typeof useIdentity>['identity'];
  soulnames?: ReturnType<typeof useSoulNames>['soulnames'];
  creditScores?: ReturnType<typeof useCreditScores>['creditScores'];
}

export const MasaClientContext = createContext({} as MasaClientProviderValue);

export const MasaClientProvider = ({ children }: { children: ReactNode }) => {
  const { masa } = useMasaClient();
  const { session, loginSession, logoutSession, sessionAddress } = useSession();
  const { identity } = useIdentity();
  const { creditScores } = useCreditScores();
  const { soulnames } = useSoulNames();

  useSessionListen();
  // * useEffect to handle account switches and disconnect
  // useAsync(async () => {
  //   if (isLoadingSession) return;

  //   if (
  //     session &&
  //     masaAddress &&
  //     masaAddress === session?.user.address &&
  //     hasSession
  //   ) {
  //     return;
  //   }

  //   if (isDisconnected) {
  //     await logoutSession();
  //     return;
  //   }

  //   if (
  //     hasSession &&
  //     sessionAddress &&
  //     masaAddress &&
  //     sessionAddress !== masaAddress
  //   ) {
  //     await logoutSession();
  //   }
  // }, [
  //   isLoadingSession,
  //   sessionAddress,
  //   masaAddress,
  //   isDisconnected,
  //   logoutSession,
  //   hasSession,
  //   session,
  // ]);

  const masaClientProviderValue: MasaClientProviderValue = useMemo(
    () =>
      ({
        masa,
        session,
        sessionAddress,
        loginSession,
        logoutSession,
        identity,
        soulnames,
        creditScores,
      } as MasaClientProviderValue),
    [
      masa,
      session,
      identity,
      sessionAddress,
      loginSession,
      logoutSession,
      soulnames,
      creditScores,
    ]
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
