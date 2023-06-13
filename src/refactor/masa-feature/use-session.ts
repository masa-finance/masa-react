import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAsync, useAsyncFn } from 'react-use';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';
import { QcContext } from '../masa-provider';

export const useSession = () => {
  const { address, isDisconnected } = useWallet();
  const { masa } = useMasaClient();
  const queryClient = useQueryClient({ context: QcContext });

  const { data: hasSth } = useMutation({
    mutationFn: async () => masa?.session.checkLogin(),
    onSuccess: async (data) => {
      console.log('INQUERY', { data });
      return queryClient.invalidateQueries(['session-check', { address }]);
    },
    context: QcContext,
  });

  //   const { data: session } = useMutation({
  //     mutationFn: async () => masa?.session.checkLogin(),
  //     onSuccess: async () =>
  //       queryClient.invalidateQueries(['session', { address }]),
  //     context: QcContext,
  //   });

  const [{ loading: isLoggingIn }, loginSession] = useAsyncFn(async () => {
    if (!masa) return undefined;
    if (!address) return undefined;
    const loginObj = await masa.session.login();

    if (!loginObj) {
      return undefined;
    }
    return {
      address: loginObj.address,
      userId: loginObj.userId,
      cookie: loginObj.cookie,
    };
  }, [masa, address]);

  const { data: hasSession, refetch: checkLogin } = useQuery({
    queryKey: ['session-check', { address }],
    enabled: !!masa && !!address,
    context: QcContext,
    refetchOnMount: true,
    onError: () =>
      queryClient.invalidateQueries(['session-check', { address }]),
    queryFn: async () => {
      const hasSesh = await masa?.session.checkLogin();
      if (hasSesh) return hasSesh;
      return null;
    },
  });

  const { data: session, refetch: getSession } = useQuery({
    queryKey: ['session', { address, hasSession }],
    enabled: !!masa && !!address && hasSession !== undefined,
    context: QcContext,
    onError: () =>
      queryClient.invalidateQueries(['session-check', { address }]),
    queryFn: async () => {
      //   if (hasSession && address !== session?.user?.address) {
      //     await masa?.session.logout();
      //   }
      const sesh = await masa?.session.getSession();
      return sesh
        ? {
            ...sesh,
          }
        : null;
    },
  });

  useAsync(async () => {
    // if (isDisconnected && (await masa?.session.checkLogin())) {
    //   await masa?.session.logout();
    //   //   return;
    //   return null;
    // }

    const { data: refetchSess } = await getSession();
    console.log('DEBUG AM I HERE ?', {
      hasSession,
      refetchSess,
      address,
      session,
      //   isPreviousData,
    });
    if (session !== address && hasSession) {
      //   await masa?.session.logout();
      const { data: res } = await getSession();
      return res;
    }

    return null;
  }, [
    session,
    hasSession,
    address,
    getSession,
    // masa,
    // isDisconnected,
    // isPreviousData,
  ]);

  const [{ loading: isLoggingOut }, logoutSession] = useAsyncFn(async () => {
    await masa?.session.logout();
    await queryClient.invalidateQueries(['session', { address }]);
  }, [masa, queryClient, address]);

  console.log({ isLoggingIn, isLoggingOut, hasSession, session });
  return {
    // checkLogin,
    session,
    hasSession,
    loginSession,
    logoutSession,
    isLoggingIn,
    isLoggingOut,
    getSession,
    checkLogin,
  };
};
