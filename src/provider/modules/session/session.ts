import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { Masa } from '@masa-finance/masa-sdk';

export const useSession = (
  masa: Masa | null,
  walletAddress: string | undefined
): {
  loggedIn?: boolean;
  login: () => void;
  logout: () => void;
  status: string;
  isLoading: boolean;
  error: unknown;
} => {
  const queryKey: (string | undefined)[] = useMemo(() => {
    return ['session', walletAddress];
  }, [walletAddress]);

  const queryKeySession: (string | undefined)[] = useMemo(() => {
    return ['session-data', walletAddress];
  }, [walletAddress]);

  const { data: session } = useQuery(
    queryKeySession,
    () => masa?.session.getSession(),
    {
      enabled: !!masa,
      retry: false,
    }
  );

  const {
    data: loggedIn,
    status,
    isLoading,
    error,
  } = useQuery(queryKey, () => masa?.session.checkLogin(), {
    enabled: !!masa && !!walletAddress,
    retry: false,
  });

  useEffect(() => {
    if (session && session.user.address !== walletAddress) {
      masa?.session.logout();
      void queryClient.invalidateQueries(queryKey);
      void queryClient.refetchQueries();
    }
  }, [session, walletAddress, masa, queryKey]);

  useEffect(() => {
    if (loggedIn && !walletAddress) {
      void queryClient.invalidateQueries(queryKey);
    }
  }, [walletAddress, loggedIn, queryKey]);

  const login = useCallback(async () => {
    const logged = await masa?.session.login();
    if (logged) {
      await queryClient.invalidateQueries(queryKey);
      await queryClient.invalidateQueries(queryKey);
      await queryClient.refetchQueries();
    }
  }, [masa, queryKey]);

  const logout = useCallback(
    async (callback?: () => void) => {
      await masa?.session.logout();
      await queryClient.invalidateQueries(queryKey);
      await queryClient.refetchQueries();

      callback?.();
    },
    [masa, queryKey]
  );

  return { loggedIn, login, logout, status, isLoading, error };
};
