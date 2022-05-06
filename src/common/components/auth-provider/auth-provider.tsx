import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth } from '../auth/auth';

export function AuthProvider({ children }: Props) {
  return (
    <Auth0Provider
      domain="auth.masa.finance"
      clientId="Xg2CKYKqJTmDPerMPb5iJLARjhHO3qIM"
      audience="https://auth.masa.finance"
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
