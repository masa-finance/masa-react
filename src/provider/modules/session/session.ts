import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { ISession, Masa } from '@masa-finance/masa-sdk';

export const useSession = (
  masa?: Masa,
  walletAddress?: string
): {
  isLoggedIn?: boolean;
  isSessionLoading: boolean;
  handleLogin: () => void;
  handleLogout: (logoutCallback?: () => void) => void;
  status: string;
  error: unknown;
} => {
  const queryKeySessionData: (string | undefined)[] = useMemo(() => {
    return ['session', 'data', walletAddress];
  }, [walletAddress]);

  const {
    data: sessionData,
    isLoading: isSessionDataLoading,
    isFetching: isSessionDataFetching,
  } = useQuery<ISession | undefined>(
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
    data: isLoggedIn,
    status,
    isLoading: isSessionCheckLoading,
    isFetching: isSessionCheckFetching,
    error,
  } = useQuery<boolean | undefined>(
    queryKeySession,
    () => masa?.session.checkLogin(),
    {
      enabled: !!masa && !!walletAddress,
      retry: false,
    }
  );

  const clearSession = useCallback(async () => {
    await queryClient.invalidateQueries(['wallet']);
    await queryClient.invalidateQueries(['session']);
  }, []);

  const handleLogout = useCallback(
    async (logoutCallback?: () => void): Promise<void> => {
      await masa?.session.logout();
      await clearSession();

      logoutCallback?.();
    },
    [masa, clearSession]
  );

  const handleLogin = useCallback(async (): Promise<void> => {
    const isLoggedIn = await masa?.session.login();

    if (isLoggedIn) {
      await clearSession();
    }
  }, [masa, clearSession]);

  useEffect(() => {
    if (sessionData && sessionData.user.address !== walletAddress) {
      void handleLogout();
    }
  }, [sessionData, walletAddress, handleLogout]);

  return {
    isLoggedIn,
    isSessionLoading:
      isSessionCheckLoading ||
      isSessionCheckFetching ||
      isSessionDataLoading ||
      isSessionDataFetching,
    handleLogin,
    handleLogout,
    status,
    error,
  };
};
