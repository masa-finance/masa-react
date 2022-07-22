import { useAuth0 } from '@auth0/auth0-react';

import React, { useCallback, useEffect, useState } from 'react';
import { masaToolsProvider } from '../../helpers/provider';
const XMasaToolsProvider = masaToolsProvider;
export interface MasaToolsWrapperProps {
  children: React.ReactNode;
}
export function MasaToolsWrapper({ children }: MasaToolsWrapperProps) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<undefined | string>(undefined);

  const handleToken = useCallback(async () => {
    if (isAuthenticated && !isLoading) {
      const newToken = await getAccessTokenSilently();
      setToken(newToken);
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  useEffect(() => {
    handleToken();
  }, [handleToken]);

  return (
    <XMasaToolsProvider accessToken={token}>{children}</XMasaToolsProvider>
  );
}
