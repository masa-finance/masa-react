import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-provider';

export const useSession = function (masa, walletAddress) {
  const { data, status, isLoading, error } = useQuery(
    `session-${walletAddress}`,
    () => masa.session.checkLogin(),
    { enabled: !!masa && !!walletAddress }
  );

  useEffect(() => {
    if (data && data?.user?.address && walletAddress) {
      if (data?.user?.address !== walletAddress) {
        queryClient.invalidateQueries(`session-${walletAddress}`);
      }
    }
  }, [walletAddress, data]);

  const login = useCallback(async () => {
    const logged = await masa.session.login();
    if (logged) {
      queryClient.invalidateQueries(`session-${walletAddress}`);
    }
  }, [masa]);

  const logout = useCallback(async (callback) => {
    const logged = await masa.session.logout();
    if (logged) {
      queryClient.invalidateQueries(`session-${walletAddress}`);
    }
    if(callback) {
        callback()
    }
  }, [masa]);

  return { session: data, login, logout, status, isLoading, error };
};
