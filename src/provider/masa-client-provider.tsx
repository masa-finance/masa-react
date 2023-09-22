import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useAsync } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';

import { useIdentity } from '../masa/use-identity';
import { useSession } from '../masa/use-session';
import { useCreditScores } from '../masa/use-credit-scores';
import { useSoulNames } from '../masa/use-soulnames';
import { useGreen } from '../masa/use-green';
import { useIdentityListen } from '../masa';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export interface MasaClientProviderValue {
  masa?: ReturnType<typeof useMasaClient>['sdk'];
  session?: ReturnType<typeof useSession>['session'];
  identity?: ReturnType<typeof useIdentity>['identity'];
  soulnames?: ReturnType<typeof useSoulNames>['soulnames'];
  creditScores?: ReturnType<typeof useCreditScores>['creditScores'];
  greens?: ReturnType<typeof useGreen>['greens'];
}

export const MasaClientContext = createContext({} as MasaClientProviderValue);

export const MasaClientProvider = ({ children }: { children: ReactNode }) => {
  const { masa, masaAddress } = useMasaClient();
  const queryClient = useMasaQueryClient();
  const {
    session,
    hasSession,
    checkLogin,
    loginSession,
    logoutSession,
    sessionAddress,
  } = useSession();
  const { identity, getIdentity } = useIdentity();
  const { creditScores } = useCreditScores();
  const { soulnames } = useSoulNames();
  const { greens } = useGreen();

  useIdentityListen({ identity, getIdentity, sessionAddress });
  // useSessionListen();

  // session-listen
  useAsync(async () => {
    if (!!sessionAddress && sessionAddress !== masaAddress && hasSession) {
      await Promise.all([
        queryClient.setQueryData(
          ['session-new-check', { masaAddress, persist: true }],
          false
        ),
      ]);

      await logoutSession();
      await checkLogin();
    }
  }, [
    queryClient,
    masaAddress,
    sessionAddress,
    hasSession,
    logoutSession,
    checkLogin,
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
        soulnames,
        creditScores,
        greens,
      }) as MasaClientProviderValue,
    [
      masa,
      identity,
      session,
      sessionAddress,
      loginSession,
      logoutSession,
      soulnames,
      creditScores,
      greens,
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