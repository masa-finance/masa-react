import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useAsync } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';

import { useIdentity } from '../masa/use-identity';
import { useSession } from '../masa/use-session';
// import type { useCreditScores } from '../masa/use-credit-scores';
// import type { useSoulNames } from '../masa/use-soulnames';
// import type { useGreen } from '../masa/use-green';
import { useIdentityListen } from '../masa';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export interface MasaClientProviderValue {
  // masa?: ReturnType<typeof useMasaClient>['sdk'];
  // session?: ReturnType<typeof useSession>['session'];
  // identity?: ReturnType<typeof useIdentity>['identity'];
  // soulnames?: ReturnType<typeof useSoulNames>['soulnames'];
  // creditScores?: ReturnType<typeof useCreditScores>['creditScores'];
  // greens?: ReturnType<typeof useGreen>['greens'];
}

export const MasaClientContext = createContext({} as MasaClientProviderValue);

export const MasaClientProvider = ({ children }: { children: ReactNode }) => {
  const {
    // masa,
    masaAddress,
  } = useMasaClient();
  const queryClient = useMasaQueryClient();
  const {
    // session,
    // loginSession,
    hasSession,
    checkLogin,
    logoutSession,
    sessionAddress,
  } = useSession();
  const { identity, getIdentity } = useIdentity();

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
    () => ({}) as MasaClientProviderValue,
    []
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
