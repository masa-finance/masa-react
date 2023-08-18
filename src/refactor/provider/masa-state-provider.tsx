import React, { ReactNode, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import MasaClientProvider from './masa-client-provider';
import { createQueryClient } from '../masa-client/query-client';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

export const MasaStateProvider = ({
  children,
  HydrationRQ,
}: {
  children: ReactNode;
  HydrationRQ?: typeof ReactQueryStreamedHydration;
}) => {
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider context={MasaQueryClientContext} client={queryClient}>
      {HydrationRQ ? (
        <HydrationRQ>
          <MasaClientProvider>{children}</MasaClientProvider>
        </HydrationRQ>
      ) : (
        <MasaClientProvider>{children}</MasaClientProvider>
      )}
    </QueryClientProvider>
  );
};
