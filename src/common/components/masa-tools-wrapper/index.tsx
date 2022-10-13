import React, { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MasaToolsProvider } from '../../helpers/provider/masa-tools-provider';

export interface MasaToolsWrapperProps {
  children: React.ReactNode;
}

export const MasaToolsWrapper = ({ children }: MasaToolsWrapperProps) => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string | undefined>(undefined);

  const handleToken = useCallback(async () => {
    if (isAuthenticated && !isLoading) {
      const newToken = await getAccessTokenSilently();
      setToken(newToken);
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  useEffect(() => {
    void handleToken();
  }, [handleToken]);

  return <MasaToolsProvider accessToken={token}>{children}</MasaToolsProvider>;
};
