import { useQuery } from '@tanstack/react-query';
import { useAsync, useAsyncFn } from 'react-use';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';

export const useSession = () => {
  const { address, isDisconnected } = useWallet();
  const { masa } = useMasaClient();

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

    queryFn: async () => {
      const hasSesh = await masa?.session.checkLogin();
      if (hasSesh) return hasSesh;
      return null;
    },
  });

  const {
    data: session,
    refetch: getSession,
    isPreviousData,
  } = useQuery({
    queryKey: ['session', { address, hasSession }],
    enabled: !!masa && !!address && hasSession !== undefined,

    queryFn: async () => {
      if (hasSession && address !== session?.user?.address) {
        await masa?.session.logout();
      }
      const sesh = await masa?.session.getSession();
      return sesh
        ? {
            ...sesh,
          }
        : undefined;
    },
  });

  useAsync(async () => {
    const { data: refetchSess } = await getSession();
    console.log('DEBUG AM I HERE ?', {
      hasSession,
      refetchSess,
      address,
      session,
      isPreviousData,
    });

    if (isDisconnected) {
      await masa?.session.logout();
      //   return;
    }
    if (session !== address && hasSession) {
      //   await masa?.session.logout();
      const { data: res } = await getSession();
    }
  }, [
    session,
    hasSession,
    address,
    masa,
    getSession,
    isDisconnected,
    isPreviousData,
  ]);

  const [{ loading: isLoggingOut }, logoutSession] = useAsyncFn(async () => {
    await masa?.session.logout();
  }, [masa]);
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
