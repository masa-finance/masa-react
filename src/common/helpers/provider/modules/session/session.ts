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
  const queryKey: string = useMemo(() => {
    return `session-${walletAddress}-${masa?.config.network}`;
  }, [walletAddress, masa]);

  const {
    data: loggedIn,
    status,
    isLoading,
    error,
  } = useQuery(queryKey, () => masa?.session.checkLogin(), {
    enabled: !!masa && !!walletAddress,
  });

  useEffect(() => {
    if (loggedIn && walletAddress) {
      void queryClient.invalidateQueries(queryKey);
    }
  }, [walletAddress, loggedIn, queryKey]);

  const login = useCallback(async () => {
    const logged = await masa?.session.login();
    if (logged) {
      await queryClient.invalidateQueries(queryKey);
      await queryClient.refetchQueries();
    }
  }, [masa, walletAddress, queryKey]);

  const logout = useCallback(
    async (callback?: () => void) => {
      await masa?.session.logout();
      await queryClient.invalidateQueries(queryKey);
      await queryClient.refetchQueries();

      if (callback) {
        callback();
      }
    },
    [masa, walletAddress, queryKey]
  );

  return { loggedIn, login, logout, status, isLoading, error };
};
