import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAsync, useAsyncFn } from 'react-use';
import type { ISession } from '@masa-finance/masa-sdk';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';
import { QcContext } from '../masa-provider';

export const useSession = () => {
  const { address, isDisconnected, previousAddress } = useWallet();
  const { masa } = useMasaClient();
  const queryClient = useQueryClient({ context: QcContext });
  //   console.log({ address, previousAddress });
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
        if (!resultCheck) {
          //   await queryClient.invalidateQueries(['session-check', address]);
        }
      }
    },
    queryFn: async () => getSessionAsync(),
  });

  const { data: hasSession, refetch: checkLogin } = useQuery({
    queryKey: ['session-check', address],
    enabled: !!masa,
    context: QcContext,
    onSuccess: async (data: boolean) => {
      switch (data) {
        case true: {
          const checkedLogin = await checkSession();

          if (!checkedLogin) {
            await queryClient.invalidateQueries(['session-obj', address]);
            await queryClient.invalidateQueries(['session-check', address]);
            await queryClient.invalidateQueries(['session', address]);
            return;
          }

          if (sessionFromGet && address === sessionFromGet?.user.address) {
            return;
          }

          await queryClient.invalidateQueries(['session-obj', address]);
          await queryClient.fetchQuery(['session-obj', address]);
          break;
        }

        case false: {
          queryClient.setQueryData(['session', address], null);
          queryClient.setQueryData(['session-obj', address], null);
          break;
        }
        case undefined: {
          queryClient.setQueryData(['session', address], null);
          queryClient.setQueryData(['session-obj', address], null);
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

      const hasSesh = await checkSession();

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
    enabled: false,
    context: QcContext,
    refetchOnMount: false,

    onSettled: async () => {
      await checkLogin();
    },

    queryFn: async () => {
      const hasIt = await checkSession();

      if (hasIt) {
        const sesshFromGet = await masa?.session.getSession();

        if (sesshFromGet === undefined || sesshFromGet === null) {
          return null;
        }

        return sesshFromGet;
      }

      const sesh = await loginSession();

      if (sesh === undefined || sesh === null) return null;

      return sesh;
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
