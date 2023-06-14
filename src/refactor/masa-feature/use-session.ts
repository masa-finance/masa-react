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
      if (hasSesh !== undefined || hasSesh !== null) return hasSesh;

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

  const [, getSessionAsync] = useAsyncFn(async () => {
    console.log('GET SESSION CB');
    if (!masa) return null;
    if (!address) return null;

    const seshFromGet = await masa?.session.getSession();

    if (seshFromGet === undefined || seshFromGet === null) {
      return null;
    }

    return seshFromGet;
  }, [address, masa]);

  const {
    data: sessionFromGet,
    isLoading: isFetchingSession,
    refetch: getSessionCB,
  } = useQuery({
    queryKey: ['session-obj', address],
    enabled: false,
    context: QcContext,
    onSuccess: async (data: ISession | null) => {
      if (data) {
        const resultCheck = await checkSession();
        console.log('ON SUCESS RESULTCHECk', { resultCheck });
        if (!resultCheck) {
          console.log('NO SESSION IN ONSUCCESS, invalidating session-check', {
            resultCheck,
          });
          //   await queryClient.invalidateQueries(['session-check', address]);
        }
        console.log('session-obj onSuccess', data);
      }
    },
    queryFn: async () => {
      console.log('SESSION OBJ QUERY FUNC START');
      return getSessionAsync();
    },
  });

  const { data: hasSession, refetch: checkLogin } = useQuery({
    queryKey: ['session-check', address],
    enabled: !!masa && !!address,
    context: QcContext,
    onSuccess: async (data: boolean) => {
      console.log('ON SUCCESS checkLogin');
      switch (data) {
        case true: {
          console.log('AM I HERE CASE TRUE?');
          //   await getSessionCB();
          const checkedLogin = await checkSession();
          console.log({ checkedLogin }, 'BRUV');
          if (!checkedLogin) {
            console.log(' NO CHECKECD LOGIN, invalidating and returning');
            await queryClient.invalidateQueries(['session-obj', address]);
            await queryClient.invalidateQueries(['session-check', address]);
            await queryClient.invalidateQueries(['session', address]);
            return;
          }

          if (sessionFromGet && address === sessionFromGet?.user.address) {
            console.log('returning cause addresses metched', {
              address,
              sesAddr: sessionFromGet?.user.address,
            });
            return;
          }

          console.log('address mismatch');
          await queryClient.invalidateQueries(['session-obj', address]);
          await queryClient.fetchQuery(['session-obj', address]);
          //   await queryClient.refetchQueries({
          //     queryKey: ['session-obj', address],
          //     // type: 'all',
          //   });
          //   await queryClient.refetchQueries({ queryKey: ['session', address] });
          //   await queryClient.invalidateQueries(['session', address]);
          //   await queryClient.fetchQuery(['session', address]);

          break;
        }
        case false: {
          console.log('CASE FALSE');
          //   await queryClient.invalidateQueries(['session', address]);
          //   await queryClient.invalidateQueries(['session-obj', address]);
          queryClient.setQueryData(['session', address], null);
          queryClient.setQueryData(['session-obj', address], null);
          break;
        }
        case undefined: {
          //   await queryClient.invalidateQueries(['session', address]);
          //   await queryClient.invalidateQueries(['session-obj', address]);
          queryClient.setQueryData(['session', address], null);
          queryClient.setQueryData(['session-obj', address], null);
          break;
        }
        default: {
          break;
        }
      }
    },
    // refetchOnMount: true,
    // refetchOnReconnect: 'always',
    queryFn: async () => {
      console.log('CHECK SESSION QUERY FUNC START');
      if (!address) return false;
      if (!masa) return false;
      const hasSesh = await checkSession();
      console.log('CHECK SESSION QUERY FUNC', { hasSesh });

      if (hasSesh) {
        return hasSesh;
      }

      return false;
    },
  });

  const [{ loading: isLoggingOut }, logoutSession] = useAsyncFn(async () => {
    if (hasSession) {
      await masa?.session.logout();
    }

    await queryClient.invalidateQueries(['session-check', address]);
    await queryClient.invalidateQueries(['session', address]);
    await queryClient.invalidateQueries(['session-obj', address]);
  }, [masa, queryClient, address, hasSession]);

  const { data: session, refetch: getSession } = useQuery({
    queryKey: ['session', address],
    // enabled: !!masa && !!address,
    enabled: false,

    context: QcContext,
    refetchOnMount: false,
    onSuccess: async (data: ISession | null) => {
      if (data) {
        console.log('We have data onsuccess SESSION QUERY FUNC');
      } else {
        console.log('We DONT have data onsuccess SESSION QUERY FUNC');
      }
    },
    onSettled: async (data, error) => {
      console.log('SETTLED WITH', data);
      await checkLogin();
      if (error) console.log('ERROR QUERY', error);
    },
    // onSuccess: async () => checkLogin(),

    queryFn: async () => {
      //   return {};
      console.log('SESSION QUERY FUNC START');
      const hasIt = await checkSession();
      console.log({ hasIt });
      if (hasIt) {
        // if (session) return session;
        // if (session?.user?.address !== address) {
        //   console.log('ADDRESS MISMATCH');
        //   await queryClient.invalidateQueries(['session', address]);
        //   await queryClient.invalidateQueries(['session-check', address]);
        //   return null;
        // }

        const sesshFromGet = await masa?.session.getSession();

        if (sesshFromGet === undefined || sesshFromGet === null) {
          return null;
        }

        return sesshFromGet;
      }

      console.log('SESSION QUERY FUNC, DONT HAVE SESSION, LOGGING IN ');
      const sesh = await loginSession();

      if (sesh === undefined || sesh === null) return null;

      return sesh;
    },
  });

  useAsync(async () => {
    console.log('USE ASYNC TO SWITCH ACCS ON LOGUOt', {
      hasSession,
      address,
      seshAddress: session?.user.address,
      session,
    });

    console.log('USE ASYNC TO SWITCH ACCS ON LOGUOt', {
      hasSession,
      address,
      seshFromGetAddress: sessionFromGet?.user.address,
      sessionFromGet,
    });

    if (!address) return;
    if (isDisconnected) return;
    if (!hasSession) {
      const { data: isLogged } = await checkLogin();

      if (isLogged) {
        console.log('LOGGING OUT USEASYNC');
        // await logoutSession();
        // await queryClient.invalidateQueries(['session-check', address]);
      }
      return;
    }

    if (hasSession) {
      if (sessionFromGet === null) {
        console.log('SESSION FROM GET IS NULL');
        console.log('LOGGING OUT USEASYNC');
        // await logoutSession();
        // await queryClient.invalidateQueries(['session-check', address]);
        return;
      }
      console.log("hasSession && sessionFromGet !== null, don't logout");
    }

    if (
      sessionFromGet?.user.address &&
      sessionFromGet?.user.address !== address
    ) {
      console.log('HOPEFULLY CHANGED ACCOUNTS TWO');
      console.log('HERE logging out', sessionFromGet?.user.address, address);
      const { data: isLgd } = await checkLogin();
      if (isLgd) {
        // await logoutSession();
        // await queryClient.invalidateQueries(['session-check', address]);
      }
    }
  }, [
    queryClient,
    hasSession,
    address,
    session,
    // logoutSession,
    isDisconnected,
    sessionFromGet,
    checkLogin,
  ]);

  return {
    // checkLogin,
    session,
    sessionFromGet,
    getSessionCB,
    isFetchingSession,
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
