import React, { ReactNode, useMemo } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import MasaClientProvider from './masa-client-provider';
import { createQueryClient } from '../masa-client/query-client';

const undev = undefined;

export const MasaQueryClientContext = React.createContext<
  QueryClient | undefined
>(undev);

export const MasaStateProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useMemo(() => createQueryClient(), []);
  return (
    <QueryClientProvider context={MasaQueryClientContext} client={queryClient}>
      <MasaClientProvider>{children}</MasaClientProvider>
    </QueryClientProvider>
  );
};
