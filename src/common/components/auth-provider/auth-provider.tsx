import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth } from '../auth';

export function AuthProvider({ children }: Props) {
  return (
    <Auth0Provider
      domain="masa-development.us.auth0.com"
      clientId="tgdMG3ecxLEwnXPcbR7CMF8SvJndtyWU"
      audience="https://auth.masa.finance/dev"
      redirectUri={window.location.origin}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <Auth />
      {children}
    </Auth0Provider>
  );
}

export interface Props {
  children: React.ReactNode;
}
