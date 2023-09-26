import {
  // useAsync,
  useAsyncFn,
} from 'react-use';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
// import { useMasaQueryClient } from '../masa-client/use-masa-query-client';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useSessionConnect } from './use-session-connect';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

export const useSession = () => {
  const { address } = useWallet();
  // const queryClient = useMasaQueryClient();
  const { sdk: masa, masaAddress } = useMasaClient();
  const { isLoggingIn, isLoggingOut, loginSessionAsync, logoutSession } =
    useSessionConnect();
  const [, getSessionAsync] = useAsyncFn(async () => {
    const seshFromGet = await masa?.session.getSession();
    return seshFromGet ?? null;
  }, [masa]);

  const [, checkSessionAsync] = useAsyncFn(async () => {
    const hasSesh = await masa?.session.checkLogin();

    return hasSesh ?? null;
  }, [masa]);

  // * queries
  const {
    data: hasSession,
    refetch: checkLogin,
    isFetching: isCheckingLogin,
  } = useQuery({
    queryKey: ['session-new-check', { masaAddress, persist: true }],
    enabled: !!masaAddress,
    context: MasaQueryClientContext,
    cacheTime: 0,
    queryFn: async () => {
      if (!checkSessionAsync) {
        return null;
      }

      const hasSesh = await checkSessionAsync();

      return hasSesh ?? false;
    },
  });

  const {
    data: session,
    isFetching: isFetchingSession,
    refetch: getSession,
  } = useQuery({
    queryKey: ['session-new', { masaAddress, persist: false }],
    enabled:
      !!hasSession &&
      masaAddress === address &&
      !isLoggingOut &&
      !!getSessionAsync,
    cacheTime: 0,
    context: MasaQueryClientContext,
    queryFn: async () => {
      const sesh = await getSessionAsync();

      return sesh ?? null;
    },
  });

  const sessionAddress = useMemo(() => {
    if (address === masaAddress && session?.user.address) {
      return session.user.address;
    }

    return undefined;
  }, [session, address, masaAddress]);

  // // session-listens
  // useAsync(async () => {
  //   if (!!sessionAddress && sessionAddress !== masaAddress && hasSession) {
  //     await Promise.all([
  //       queryClient.setQueryData(
  //         ['session-new-check', { masaAddress, persist: true }],
  //         false
  //       ),
  //     ]);

  //     await logoutSession();
  //     await checkLogin();
  //   }
  // }, [
  //   queryClient,
  //   masaAddress,
  //   sessionAddress,
  //   hasSession,
  //   logoutSession,
  //   checkLogin,
  // ]);

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
