import React, { createContext, useContext } from 'react';

const envToken = process.env.REACT_APP_MASA_TOOLS_USER_ACCESS_TOKEN;

export const ACCESS_TOKEN_CONTEXT = createContext<AccessTokenShape | undefined>(
  undefined
);

export interface AccessTokenProps extends AccessTokenShape {
  children: React.ReactNode;
}

export interface AccessTokenShape {
  accessToken?: string;
}

export const AccessTokenProvider = ({
  children,
  accessToken,
}: AccessTokenProps) => {
  const context = { accessToken };

  return (
    <ACCESS_TOKEN_CONTEXT.Provider value={context}>
      {children}
    </ACCESS_TOKEN_CONTEXT.Provider>
  );
};

export const useAccessToken = () => {
  const accessContext = useContext(ACCESS_TOKEN_CONTEXT);

  if (envToken) return { token: envToken, isLoading: false };

  if (accessContext) {
    return { token: accessContext.accessToken, isLoading: false };
  }

  return {
    isLoading: false,
  };
};
