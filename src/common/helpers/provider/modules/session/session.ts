import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-provider';

export const useSession = function (masa, walletAddress) {
  const { data, status, isLoading, error } = useQuery(
    `session-${walletAddress}`,
    () => masa.session.checkLogin(),
    { enabled: !!masa && !!walletAddress }
  );

  console.log('SESSION DATA', { data, walletAddress });
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
      queryClient.refetchQueries()
    }
  }, [masa]);

  const logout = useCallback(
    async (callback) => {
      await masa.session.logout();
      queryClient.invalidateQueries(`session-${walletAddress}`);
      queryClient.refetchQueries()

      if (callback) {
        callback();
      }
    },
    [masa]
  );

  return { session: data, login, logout, status, isLoading, error };
};
