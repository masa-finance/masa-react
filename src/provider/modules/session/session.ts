import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { ISession, Masa } from '@masa-finance/masa-sdk';

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
  const queryKeySessionData: (string | undefined)[] = useMemo(() => {
    return ['session-data', walletAddress];
  }, [walletAddress]);

  const { data: sessionData } = useQuery<ISession | undefined>(
    queryKeySessionData,
    () => masa?.session.getSession(),
    {
      enabled: !!masa && !!walletAddress,
      retry: false,
    }
  );

  const queryKeySession: (string | undefined)[] = useMemo(() => {
    return ['session', walletAddress];
  }, [walletAddress]);

  const {
    data: loggedIn,
    status,
    isLoading,
    error,
  } = useQuery<boolean | undefined>(
    queryKeySession,
    () => masa?.session.checkLogin(),
    {
      enabled: !!masa && !!walletAddress,
      retry: false,
    }
  );

  useEffect(() => {
    const logout = async (): Promise<void> => {
      await masa?.session.logout();
      await queryClient.invalidateQueries(queryKeySession);
      await queryClient.refetchQueries();
    };

    if (sessionData && sessionData.user.address !== walletAddress) {
      void logout();
    }
  }, [sessionData, walletAddress, masa, queryKeySession]);

  useEffect(() => {
    if (loggedIn && !walletAddress) {
      void queryClient.invalidateQueries(queryKeySession);
    }
  }, [walletAddress, loggedIn, queryKeySession]);

  const login = useCallback(async () => {
    const isLoggedIn = await masa?.session.login();

    if (isLoggedIn) {
      await queryClient.invalidateQueries(queryKeySession);
      await queryClient.invalidateQueries(queryKeySessionData);
      await queryClient.refetchQueries();
    }
  }, [masa, queryKeySession, queryKeySessionData]);

  const logout = useCallback(
    async (callback?: () => void) => {
      await masa?.session.logout();
      await queryClient.invalidateQueries(queryKeySession);
      await queryClient.refetchQueries();

      callback?.();
    },
    [masa, queryKeySession]
  );

  return { loggedIn, login, logout, status, isLoading, error };
};
