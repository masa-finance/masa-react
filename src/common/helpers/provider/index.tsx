import React, { createContext } from 'react';
import { masaRestClient } from '../../rest';
import { AccessTokenProvider } from './access-token-provider';

export const MASA_TOOLS_CONTEXT =
  createContext<MasaToolsShape | undefined>(undefined);

export interface MasaToolsProviderProps {
  children: React.ReactNode;
  accessToken: string | undefined;
}

export interface MasaToolsShape {}

export function masaToolsProvider({
  children,
  accessToken,
}: MasaToolsProviderProps) {
  const rest = masaRestClient;
  const context = { rest };

  return (
    <AccessTokenProvider accessToken={accessToken}>
      <MASA_TOOLS_CONTEXT.Provider value={context}>
        {children}
      </MASA_TOOLS_CONTEXT.Provider>
    </AccessTokenProvider>
  );
}

export function useMasaToolsHook() {
  const context = React.useContext(MASA_TOOLS_CONTEXT);
  if (context === undefined) {
    throw new Error(
      'useMasaTools must be used inside MasaToolsProvider; e.g import { MasaToolsProvider } from `"@masa-finance/tools";` '
    );
  }
  return context;
}
