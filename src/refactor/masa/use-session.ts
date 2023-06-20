import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import type { ISession } from '@masa-finance/masa-sdk';
import { useMemo } from 'react';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';
import { QcContext } from '../masa-provider';

// * NOTE: react-query does not allow us to pass undefined as a function return,
// * NOTE: so we need to convert an undefined result in every query to null
export const useSession = () => {
  const { address, isDisconnected, previousAddress, isConnected } = useWallet();
  const { masa, masaAddress } = useMasaClient();
  const queryClient = useMasaQueryClient();

  // * callbacks
  const [{ loading: isCheckingSession }, checkSessionAsync] =
    useAsyncFn(async () => {
      if (!masaAddress) return null;
      if (!masa) return null;
      if (isDisconnected) return null;

      const hasSesh = await masa?.session.checkLogin();
      if (hasSesh !== undefined || hasSesh !== null) return hasSesh;

      return null;
    }, [masa, masaAddress, isDisconnected]);

  const [, loginSessionAsync] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!masaAddress) return null;
    if (masaAddress !== address) return null;
    if (isDisconnected) return null;
    const loginObj = await masa.session.login();

    if (!loginObj) {
      return null;
    }

    return loginObj as unknown as ISession & {
      userId: string;
      address: string;
    };
  }, [masa, address, masaAddress, isDisconnected]);

  const [, getSessionAsync] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!masaAddress) return null;

    const seshFromGet = await masa?.session.getSession();

    if (seshFromGet === undefined || seshFromGet === null) {
      return null;
    }

    return seshFromGet;
  }, [masaAddress, masa]);

  const [, onSettledGetSession] = useAsyncFn(
    async (data: ISession | null | undefined) => {
      if (!data) return;

      if (data?.user.address !== masaAddress) {
        await queryClient.invalidateQueries([
          'session',
          { masaAddress, persist: false },
        ]);
        queryClient.setQueryData(
          ['session', { masaAddress, persist: false }],
          null
        );

        await queryClient.invalidateQueries([
          'session-check',
          { masaAddress, persist: false },
        ]);
        queryClient.setQueryData(
          ['session', { masaAddress, persist: false }],
          false
        );
      }
    },
    [masaAddress, queryClient]
  );
  // * queries
  const {
    data: session,
    isFetching: isFetchingSession,
    refetch: getSession,
  } = useQuery({
    queryKey: ['session', { masaAddress, persist: false }],
    enabled: false,
    cacheTime: 0,
    context: QcContext,
    onSettled: onSettledGetSession,
    queryFn: async () => getSessionAsync(),
  });

  // * logout callback
  const [{ loading: isLoggingOut }, logoutSession] = useAsyncFn(async () => {
    await masa?.session.logout();

    await queryClient.invalidateQueries([
      'session-check',
      { masaAddress, persist: false },
    ]);
    await queryClient.invalidateQueries(['session-login', { masaAddress }]);
    await queryClient.invalidateQueries([
      'session',
      { masaAddress, persist: false },
    ]);
    queryClient.setQueryData(
      ['session-check', { masaAddress, persist: false }],
      null
    );
    queryClient.setQueryData(['session-login', { masaAddress }], null);
    queryClient.setQueryData(
      ['session', { masaAddress, persist: false }],
      null
    );
  }, [masa, queryClient, masaAddress]);

  // * session address
  const sessionAddress = useMemo(() => {
    if (!session) return undefined;
    if (!session.user) return undefined;
    return session.user.address as `0x${string}`;
  }, [session]);

  // * callback to handle succesful login to sync session state
  const [, onSuccessLogin] = useAsyncFn(
    async (data: boolean) => {
      switch (data) {
        case true: {
          if (isLoggingOut) break;

          if (session && masaAddress === session?.user.address) {
            break;
          }

          if (
            previousAddress === undefined ||
            previousAddress !== masaAddress
          ) {
            await queryClient.invalidateQueries([
              'session',
              { masaAddress, persist: false },
            ]);
            await queryClient.fetchQuery([
              'session',
              { masaAddress, persist: false },
            ]);
            break;
          }

          const checkedLogin = await checkSessionAsync();

          if (!checkedLogin) {
            await logoutSession();
            break;
          }

          // * we are in a valid session but our session data needs to be updated.
          await queryClient.fetchQuery([
            'session',
            { masaAddress, persist: false },
          ]);
          break;
        }

        case false: {
          await queryClient.invalidateQueries([
            'session',
            { masaAddress, persist: false },
          ]);
          await queryClient.invalidateQueries([
            'session-login',
            { masaAddress },
          ]);
          queryClient.setQueryData(
            ['session', { masaAddress, persist: false }],
            null
          );
          queryClient.setQueryData(['session-login', { masaAddress }], null);
          break;
        }
        case undefined: {
          await queryClient.invalidateQueries([
            'session',
            { masaAddress, persist: false },
          ]);
          await queryClient.invalidateQueries([
            'session-login',
            { masaAddress },
          ]);
          queryClient.setQueryData(
            ['session', { masaAddress, persist: false }],
            null
          );
          queryClient.setQueryData(['session-login', { masaAddress }], null);
          break;
        }
        default: {
          break;
        }
      }
    },
    [
      masaAddress,
      previousAddress,
      checkSessionAsync,
      queryClient,
      session,
      isLoggingOut,
      logoutSession,
    ]
  );

  const {
    data: hasSession,
    refetch: checkLogin,
    isFetching: isCheckingLogin,
  } = useQuery({
    queryKey: ['session-check', { masaAddress, persist: false }],
    enabled: !!masa && !!masaAddress,
    context: QcContext,
    cacheTime: 0,
    onSuccess: onSuccessLogin,

    queryFn: async () => {
      if (!isConnected) return false;
      if (!masa) return false;

      if (masaAddress !== address) {
        await queryClient.invalidateQueries([
          'session',
          { masaAddress, persist: false },
        ]);
        await queryClient.invalidateQueries([
          'session-login',
          { masaAddress, persist: false },
        ]);

        return false;
      }

      const hasSesh = await checkSessionAsync();

      if (hasSesh) {
        return hasSesh;
      }

      return false;
    },
  });

  const [, onSettledLogin] = useAsyncFn(async () => {
    if (!masa) return;
    if (!address) return;
    if (!masaAddress) return;
    if (masaAddress === sessionAddress) return;
    await checkLogin();
  }, [masa, address, masaAddress, sessionAddress, checkLogin]);

  const { refetch: loginSession, isFetching: isLoggingIn } = useQuery({
    queryKey: ['session-login', { masaAddress }],
    enabled: false,
    context: QcContext,
    refetchOnMount: false,
    cacheTime: 0,
    onSettled: onSettledLogin,

    queryFn: async () => {
      if (isDisconnected) return null;
      if (hasSession) return null;

      await loginSessionAsync();

      return null;
    },
  });

  const isLoadingSession = useMemo(
    () =>
      isLoggingIn ||
      isLoggingOut ||
      isFetchingSession ||
      isCheckingLogin ||
      isCheckingSession,
    [
      isLoggingIn,
      isLoggingOut,
      isFetchingSession,
      isCheckingLogin,
      isCheckingSession,
    ]
  );

  return {
    session,
    sessionAddress,
    getSession,
    isFetchingSession,
    hasSession,
    checkSessionAsync,
    isCheckingSession,
    isCheckingLogin,
    loginSession,
    logoutSession,
    isLoggingIn,
    isLoggingOut,
    isLoggedIn: hasSession,
    checkLogin,
    isLoadingSession,
  };
};
