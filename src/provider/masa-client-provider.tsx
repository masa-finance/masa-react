import React, {
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useAsync } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';

import { useIdentity } from '../masa/use-identity';
import { useSession } from '../masa/use-session';
import { useIdentityListen } from '../masa';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const MasaClientContext: Context<boolean> =
  createContext<boolean>(false);

export const MasaClientProvider = ({ children }: { children: ReactNode }) => {
  const {
    // masa,
    masaAddress,
  } = useMasaClient();
  const queryClient = useMasaQueryClient();
  const { hasSession, checkLogin, logoutSession, sessionAddress } =
    useSession();
  const { identity, getIdentity } = useIdentity();

  useIdentityListen({ identity, getIdentity, sessionAddress });

  // session-listen
  useAsync(async () => {
    if (!!sessionAddress && sessionAddress !== masaAddress && hasSession) {
      await queryClient.setQueryData(
        ['session-new-check', { masaAddress, persist: true }],
        false
      );

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

  const masaClientProviderValue: boolean = useMemo(() => true, []);

  return (
    <MasaClientContext.Provider value={masaClientProviderValue}>
      {children}
    </MasaClientContext.Provider>
  );
};

export const useMasaClientProvider = (): boolean =>
  useContext(MasaClientContext);

export default MasaClientProvider;
