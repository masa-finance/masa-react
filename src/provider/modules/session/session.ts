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
  const queryKey: any[] = useMemo(() => {
    return ['session', walletAddress];
  }, [walletAddress]);

  const {
    data: loggedIn,
    status,
    isLoading,
    error,
  } = useQuery(queryKey, () => masa?.session.checkLogin(), {
    enabled: !!masa && !!walletAddress,
  });

  useEffect(() => {
    if (loggedIn && !walletAddress) {
      void queryClient.invalidateQueries('session');
    }
  }, [walletAddress, loggedIn, queryKey]);

  const login = useCallback(async () => {
    const logged = await masa?.session.login();
    if (logged) {
      await queryClient.invalidateQueries('session');
      await queryClient.refetchQueries();
    }
  }, [masa, queryKey]);

  const logout = useCallback(
    async (callback?: () => void) => {
      await masa?.session.logout();
      await queryClient.invalidateQueries('session');
      await queryClient.refetchQueries();

      if (callback) {
        callback();
      }
    },
    [masa, queryKey]
  );

  return { loggedIn, login, logout, status, isLoading, error };
};
