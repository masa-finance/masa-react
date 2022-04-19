import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';

const envToken = process.env.REACT_APP_MASA_TOOLS_USER_ACCESS_TOKEN;

export function useToken() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<undefined | string>(undefined);

  const getToken = useCallback(async () => {
    if (!isLoading && isAuthenticated) {
      const t = await getAccessTokenSilently();
      setToken(t);
    }
  }, [setToken, isAuthenticated, isLoading]);

  useEffect(() => {
    getToken();
  }, [getToken]);

  if (envToken) return { envToken, isLoading: false };

  return { token, isLoading };
}
