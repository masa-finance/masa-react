import React, { createContext } from 'react';

export const ACCESS_TOKEN_CONTEXT = createContext<AccessTokenShape | undefined>(
  undefined
);

export interface AccessTokenProps extends AccessTokenShape {
  children: React.ReactNode;
}

export interface AccessTokenShape {
  accessToken?: string;
}

export function AccessTokenProvider({
  children,
  accessToken,
}: AccessTokenProps) {
  const context = { accessToken };

  return (
    <ACCESS_TOKEN_CONTEXT.Provider value={context}>
      {children}
    </ACCESS_TOKEN_CONTEXT.Provider>
  );
}

export function useAccessToken() {
  const context = React.useContext(ACCESS_TOKEN_CONTEXT);
  if (context === undefined) {
    throw new Error('useAccessToken must be used inside AccessTokenProvider;');
  }
  return context;
}
