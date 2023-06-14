import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAsync, useAsyncFn } from 'react-use';
import type { ISession } from '@masa-finance/masa-sdk';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';
import { QcContext } from '../masa-provider';

// * NOTE: react-query does not allow us to pass undefined as a function return,
// * NOTE: so we need to convert an undefined result in every query to null
// * TODO: split up the queries, pass context via function variable to avoid dependency cycle
// * FIXME: we are getting the session 3 times on every change, we should only get it once
export const useSession = () => {
  const { address, isDisconnected, previousAddress } = useWallet();
  const { masa } = useMasaClient();
  const queryClient = useQueryClient({ context: QcContext });

  // * callbacks
  const [{ loading: isCheckingSession }, checkSessionAsync] =
    useAsyncFn(async () => {
      if (!address) return null;
      if (!masa) return null;
      if (isDisconnected) return null;

      const hasSesh = await masa?.session.checkLogin();
      if (hasSesh !== undefined || hasSesh !== null) return hasSesh;

      return null;
    }, [masa, address, isDisconnected]);

  const [, loginSessionAsync] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!address) return null;
    if (isDisconnected) return null;
    const loginObj = await masa.session.login();

    if (!loginObj) {
      return null;
    }

    return loginObj as unknown as ISession & {
      userId: string;
      address: string;
    };
  }, [masa, address, isDisconnected]);

  const [, getSessionAsync] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!address) return null;

    const seshFromGet = await masa?.session.getSession();

    if (seshFromGet === undefined || seshFromGet === null) {
      return null;
    }

    return seshFromGet;
  }, [address, masa]);

  // * queries
  const {
    data: session,
    isLoading: isFetchingSession,
    refetch: getSession,
    isRefetching: isRefetchingSession,
  } = useQuery({
    queryKey: ['session', address],
    enabled: false,
    context: QcContext,
    onSuccess: async (data: ISession | null) => {
      if (data) {
        const resultCheck = await checkSessionAsync();
        if (!resultCheck) {
          //   await queryClient.invalidateQueries(['session-check', address]);
        }
      }
    },
    queryFn: async () => getSessionAsync(),
  });

  const {
    data: hasSession,
    refetch: checkLogin,
    isRefetching: isCheckingLogin,
  } = useQuery({
    queryKey: ['session-check', address],
    enabled: !!masa,
    context: QcContext,
    onSuccess: async (data: boolean) => {
      switch (data) {
        case true: {
          const checkedLogin = await checkSessionAsync();

          if (!checkedLogin) {
            await queryClient.invalidateQueries(['session', address]);
            await queryClient.invalidateQueries(['session-check', address]);
            await queryClient.invalidateQueries(['session-login', address]);
            return;
          }

          if (session && address === session?.user.address) {
            return;
          }

          await queryClient.invalidateQueries(['session', address]);
          await queryClient.fetchQuery(['session', address]);
          break;
        }

        case false: {
          queryClient.setQueryData(['session-login', address], null);
          queryClient.setQueryData(['session', address], null);
          break;
        }
        case undefined: {
          queryClient.setQueryData(['session-login', address], null);
          queryClient.setQueryData(['session', address], null);
          break;
        }
        default: {
          break;
        }
      }
    },

    queryFn: async () => {
      if (!address) return false;
      if (!masa) return false;

      const hasSesh = await checkSessionAsync();

      if (hasSesh) {
        return hasSesh;
      }

      return false;
    },
  });

  // * logout callback
  const [{ loading: isLoggingOut }, logoutSession] = useAsyncFn(async () => {
    if (hasSession) {
      await masa?.session.logout();
    }

    await queryClient.invalidateQueries(['session-check', address]);
    await queryClient.invalidateQueries(['session-login', address]);
    await queryClient.invalidateQueries(['session', address]);
  }, [masa, queryClient, address, hasSession]);

  const { refetch: loginSession, isRefetching: isLoggingIn } = useQuery({
    queryKey: ['session-login', address],
    enabled: false,
    context: QcContext,
    refetchOnMount: false,

    onSettled: async () => {
      await checkLogin();
    },

    queryFn: async () => {
      if (isDisconnected) return null;
      const hasIt = await checkSessionAsync();

      if (hasIt) return null;

      await loginSessionAsync();
      return null;
    },
  });

  useAsync(async () => {
    if (isDisconnected) {
      await logoutSession();
    }

    if (previousAddress !== address) {
      await checkLogin();
    }
  }, [address, previousAddress, checkLogin, isDisconnected, logoutSession]);

  return {
    session,
    getSession,
    isFetchingSession,
    isRefetchingSession,
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
    isLoadingSession:
      isLoggingIn ||
      isLoggingOut ||
      isFetchingSession ||
      isCheckingLogin ||
      isCheckingSession ||
      isRefetchingSession,
  };
};
