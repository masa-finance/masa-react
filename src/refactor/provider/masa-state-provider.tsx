import React, { ReactNode, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import MasaClientProvider from './masa-client-provider';
import { createQueryClient } from '../masa-client/query-client';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

export const MasaStateProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useMemo(() => createQueryClient(), []);
  return (
    <QueryClientProvider context={MasaQueryClientContext} client={queryClient}>
      <MasaClientProvider>{children}</MasaClientProvider>
    </QueryClientProvider>
  );
};
