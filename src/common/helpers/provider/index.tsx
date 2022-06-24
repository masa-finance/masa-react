import React, { createContext } from 'react';
import { masaRestClient } from '../../rest';
import { AccessTokenProvider } from './access-token-provider';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export const MASA_TOOLS_CONTEXT =
  createContext<MasaToolsShape>({});

export interface MasaToolsProviderProps {
  children: React.ReactNode;
  accessToken: string | undefined;
  apiURL?: string
}

export interface MasaToolsShape {
  apiURL?: string
}

export function masaToolsProvider({
  children,
  accessToken,
  apiURL
}: MasaToolsProviderProps) {
  const rest = masaRestClient;
  const context = { rest, apiURL };

  return (
    <AccessTokenProvider accessToken={accessToken}>
      <QueryClientProvider client={queryClient}>
        <MASA_TOOLS_CONTEXT.Provider value={context}>
          {children}
        </MASA_TOOLS_CONTEXT.Provider>
      </QueryClientProvider>
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
