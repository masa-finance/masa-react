import { useAsyncFn } from 'react-use';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ISession } from '@masa-finance/masa-sdk';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useSessionConnect } from './use-session-connect';
import { queryClient } from '../masa-client/query-client';

export const useSession = () => {
  const { address } = useWallet();
  const { masa, masaAddress } = useMasaClient();
  const { isLoggingIn, isLoggingOut, loginSessionAsync, logoutSession } =
    useSessionConnect();
  const [, getSessionAsync] = useAsyncFn(async (): Promise<ISession | null> => {
    const sessFromGet = await masa?.session.getSession();
    return sessFromGet ?? null;
  }, [masa]);

  const [, checkSessionAsync] = useAsyncFn(async (): Promise<boolean> => {
    const hasSess = await masa?.session.checkLogin();

    return hasSess ?? false;
  }, [masa]);

  // * queries
  const {
    data: hasSession,
    refetch: checkLogin,
    isFetching: isCheckingLogin,
  } = useQuery(
    {
      queryKey: [
        'session-new-check',
        { masaAddress, persist: true },
        checkSessionAsync,
      ],
      enabled: !!masaAddress,
      gcTime: 0,
      queryFn: async () => {
        if (!checkSessionAsync) {
          return null;
        }

        const hasSesh = await checkSessionAsync();

        return hasSesh ?? false;
      },
    },
    queryClient
  );

  const {
    data: session,
    isFetching: isFetchingSession,
    refetch: getSession,
  } = useQuery(
    {
      queryKey: ['session-new', { masaAddress, persist: false }],
      enabled:
        !!hasSession &&
        masaAddress === address &&
        !isLoggingOut &&
        !!getSessionAsync,
      gcTime: 0,
      queryFn: async () => {
        const sess = await getSessionAsync();

        return sess ?? null;
      },
    },
    queryClient
  );

  const sessionAddress: string | undefined = useMemo(() => {
    if (address === masaAddress && session?.user.address) {
      return session.user.address;
    }

    return undefined;
  }, [session, address, masaAddress]);

  const isLoadingSession = useMemo(
    () => isFetchingSession || isCheckingLogin || isLoggingIn || isLoggingOut,
    [isFetchingSession, isCheckingLogin, isLoggingIn, isLoggingOut]
  );

  const [, handleLogout] = useAsyncFn(
    async (logoutCallback?: () => void): Promise<void> => {
      if (!hasSession) {
        return;
      }

      try {
        await logoutSession();
      } finally {
        logoutCallback?.();
      }
    },
    [logoutSession, hasSession]
  );

  return {
    hasSession,
    session,
    sessionAddress,
    isFetchingSession,
    isCheckingLogin,
    getSession,
    checkLogin,
    isLoggingIn,
    isLoggingOut,
    loginSessionAsync,
    loginSession: loginSessionAsync,
    logoutSession,
    isLoadingSession,

    // * deprecated
    isLoggedIn: hasSession,
    isSessionLoading: isLoadingSession,
    handleLogin: loginSessionAsync,
    handleLogout,
  };
};
