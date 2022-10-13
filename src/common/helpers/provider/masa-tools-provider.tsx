import React from 'react';
import { AccessTokenProvider } from './access-token-provider';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  MASA_TOOLS_CONTEXT,
  MasaContextProvider,
} from './masa-context-provider';
import { masaRestClient } from '../../rest';

const queryClient = new QueryClient();

export interface MasaToolsProviderProps {
  children: React.ReactNode;
  accessToken: string | undefined;
  apiURL?: string;
}

export function masaToolsProvider({
  children,
  accessToken,
  apiURL,
}: MasaToolsProviderProps) {
  return (
    <AccessTokenProvider accessToken={accessToken}>
      <QueryClientProvider client={queryClient}>
        <MasaContextProvider apiURL={apiURL} rest={masaRestClient}>
          {children}
        </MasaContextProvider>
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
