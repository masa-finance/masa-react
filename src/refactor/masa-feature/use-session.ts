import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAsync, useAsyncFn } from 'react-use';
import type { ISession } from '@masa-finance/masa-sdk';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';
import { QcContext } from '../masa-provider';

export const useSession = () => {
  const { address, isDisconnected } = useWallet();
  const { masa } = useMasaClient();
  const queryClient = useQueryClient({ context: QcContext });

  const [{ loading: isCheckingSession }, checkSession] =
    useAsyncFn(async () => {
      if (!address) return null;
      if (!masa) return null;

      const hasSesh = await masa?.session.checkLogin();

      if (hasSesh) return hasSesh;

      return null;
    }, [masa, address]);

  const [{ loading: isLoggingIn }, loginSession] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!address) return null;

    const loginObj = await masa.session.login();

    if (!loginObj) {
      return null;
    }

    return loginObj as unknown as ISession & {
      userId: string;
      address: string;
    };
  }, [masa, address]);

  const { data: hasSession, refetch: checkLogin } = useQuery({
    queryKey: ['session-check', address],
    enabled: !!masa,
    context: QcContext,
    refetchOnMount: false,
    queryFn: async () => {
      console.log('CHECK SESSION QUERY FUNC START');
      if (!address) return false;
      if (!masa) return false;
      const hasSesh = await checkSession();
      if (hasSesh) {
        return hasSesh;
      }
      return false;
    },
  });

  const { data: session, refetch: getSession } = useQuery({
    queryKey: ['session', address, hasSession],
    enabled: !!masa,
    context: QcContext,
    refetchOnMount: false,
    // onSuccess: async () => checkLogin(),

    queryFn: async () => {
      console.log('SESSION QUERY FUNC START');
      if (hasSession) {
        // if (session) return session;
        // if (session?.user?.address !== address) {
        //   console.log('ADDRESS MISMATCH');
        //   await queryClient.invalidateQueries(['session', address]);
        //   await queryClient.invalidateQueries(['session-check', address]);
        //   return null;
        // }

        const sessionFromGet = await masa?.session.getSession();

        if (sessionFromGet === undefined || sessionFromGet === null) {
          return null;
        }

        return sessionFromGet;
      }

      const sesh = await loginSession();

      if (sesh === undefined || sesh === null) return null;

      await checkSession();
      return sesh;
    },
  });

  const [{ loading: isLoggingOut }, logoutSession] = useAsyncFn(async () => {
    if (hasSession) {
      await masa?.session.logout();
    }
    await queryClient.invalidateQueries(['session-check', address]);
    await queryClient.invalidateQueries(['session', address]);
  }, [masa, queryClient, address, hasSession]);

  useAsync(async () => {
    if (!address) return;
    if (!session) return;
    if (!session) return;
    if (!session.user) return;
    if (isDisconnected) return;

    if (session.user.address && session.user.address !== address) {
      console.log('HOPEFULLY CHANGED ACCOUNTS');
      console.log('sessionaddr', session?.user?.address);
      console.log('addr', address);
      console.log('sesh', session);
      await logoutSession();
    }
    // if (session?.user?.address !== address) {
    // }
  }, [address, session, logoutSession, isDisconnected]);
  //   useAsync(async () => {
  //     if (hasSession) {
  //       if (!session) {
  //         console.log('NO SESSION INVALIDATING');
  //         await queryClient.invalidateQueries(['session', address]);
  //         return;
  //       }
  //       if (session?.user?.address !== address) {
  //         // * NOTE: we have to logout as masa-middleware only stores 1 cookie per client
  //         // * NOTE: not per address
  //         console.log('ADDRESS MISMATCH');
  //         await logoutSession();
  //       }
  //     }
  //   }, [
  //     session,
  //     queryClient,
  //     hasSession,
  //     //  getSession,
  //     address,
  //     logoutSession,
  //   ]);

  //   useAsync(async () => {
  //     if (isDisconnected) await logoutSession();
  //   }, [isDisconnected, logoutSession]);

  return {
    // checkLogin,
    session,
    hasSession,
    checkSession,
    isCheckingSession,
    loginSession,
    logoutSession,
    isLoggingIn,
    isLoggingOut,
    getSession,
    checkLogin,
  };
};
