import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { ISession, Masa } from '@masa-finance/masa-sdk';
import { useAsync } from 'react-use';
import type { Signer } from 'ethers';
import { queryClient } from '../../masa-query-client';

export const getSessionQueryKey = ({
  walletAddress,
}: {
  walletAddress?: string;
  masa?: Masa;
  signer?: Signer; // unused here
}) => ['session', walletAddress];

export const getSessionDataQueryKey = ({
  walletAddress,
}: {
  walletAddress?: string;
  masa?: Masa;
  signer?: Signer; // unused here
}) => ['session', 'data', walletAddress];

export const useSessionQuery = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
}) => {
  const queryKeySession: (string | undefined)[] = useMemo(
    () => ['session', walletAddress],
    [walletAddress]
  );

  const {
    data: isLoggedIn,
    status,
    isLoading: isSessionCheckLoading,
    isFetching: isSessionCheckFetching,
    error,
    refetch: reloadSession,
  } = useQuery<boolean | undefined>(
    queryKeySession,
    () => masa?.session.checkLogin(),
    {
      enabled: !!masa,
      retry: false,
    }
  );

  return {
    isLoggedIn,
    status,
    isSessionCheckLoading,
    isSessionCheckFetching,
    error,
    reloadSession,
  };
};

export const useSessionDataQuery = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
}) => {
  const queryKeySessionData: (string | undefined)[] = useMemo(
    () => ['session', 'data', walletAddress],
    [walletAddress]
  );

  const {
    data: sessionData,
    isLoading: isSessionDataLoading,
    isFetching: isSessionDataFetching,
    refetch: reloadSessionData,
  } = useQuery<ISession | undefined>(
    queryKeySessionData,
    () => masa?.session.getSession(),
    {
      enabled: !!masa && !!walletAddress,
      retry: false,
    }
  );
  return {
    sessionData,
    isSessionDataFetching,
    isSessionDataLoading,
    reloadSessionData,
  };
};

// export type UseSessionReturnType = {
//   isLoggedIn?: boolean;
//   isSessionLoading: boolean;
//   reloadSession: () => Promise<void>;
//   reloadSessionData: () => Promise<void>;
//   handleLogin: () => Promise<void>;
//   handleLogout: (logoutCallback?: () => void) => Promise<void>;
//   status: string;
//   error: unknown;
// };

export const useSession = (masa?: Masa, walletAddress?: string) => {
  const {
    sessionData,
    isSessionDataFetching,
    isSessionDataLoading,
    reloadSessionData,
  } = useSessionDataQuery({ masa, walletAddress });
  const {
    isLoggedIn,
    status,
    isSessionCheckLoading,
    isSessionCheckFetching,
    reloadSession,
    error,
  } = useSessionQuery({ masa, walletAddress });

  // const { disconnectAsync } = useDisconnect();
  const clearSession = useCallback(async () => {
    await queryClient.invalidateQueries(['wallet']);
    await queryClient.invalidateQueries(['session']);
  }, []);

  const handleLogout = useCallback(
    async (logoutCallback?: () => void): Promise<void> => {
      if (!isLoggedIn) {
        return;
      }

      try {
        await masa?.session.sessionLogout();
      } finally {
        await clearSession();
        logoutCallback?.();
      }
    },
    [masa, clearSession, isLoggedIn]
  );

  const handleLogin = useCallback(async (): Promise<void> => {
    let loggedIn;
    try {
      loggedIn = await masa?.session.login();

      if (loggedIn) {
        await clearSession();
      }
    } catch (error_) {
      console.log('DEBUG Sesssion first catch', {
        e: error_,
        masa,
        walletAddress,
      });
    }
  }, [masa, clearSession, walletAddress]);

  useAsync(async () => {
    await reloadSessionData();
  }, [walletAddress, reloadSession, reloadSessionData]);

  useAsync(async () => {
    if (
      isLoggedIn &&
      sessionData &&
      sessionData.user.address !== walletAddress
    ) {
      console.error('Session mismatch detected, logging out!');
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
    reloadSession,
    reloadSessionData,
    status,
    error,
  };
};
