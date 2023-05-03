import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { ISession, Masa } from '@masa-finance/masa-sdk';
import { useDisconnect } from 'wagmi';

export const useSession = (
  masa?: Masa,
  walletAddress?: string
): {
  isLoggedIn?: boolean;
  isSessionLoading: boolean;
  handleLogin: () => void;
  handleLogout: (logoutCallback?: () => void) => Promise<void>;
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

  const { disconnect } = useDisconnect();
  const clearSession = useCallback(async () => {
    await queryClient.invalidateQueries(['wallet']);
    await queryClient.invalidateQueries(['session']);
  }, []);

  const handleLogout = useCallback(
    async (logoutCallback?: () => void): Promise<void> => {
      if (!isLoggedIn) {
        return;
      }

      await masa?.session.sessionLogout();
      disconnect();
      await clearSession();

      logoutCallback?.();
    },
    [masa, clearSession, isLoggedIn, disconnect]
  );

  const handleLogin = useCallback(async (): Promise<void> => {
    const isLoggedIn = await masa?.session.login();

    if (isLoggedIn) {
      await clearSession();
    }
  }, [masa, clearSession]);

  useEffect(() => {
    if (
      isLoggedIn &&
      sessionData &&
      sessionData.user.address !== walletAddress
    ) {
      void handleLogout();
    }
  }, [sessionData, walletAddress, handleLogout, isLoggedIn]);

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
