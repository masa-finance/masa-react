import React, { ReactNode } from 'react';
// import { QueryClientProvider } from '@tanstack/react-query';
import MasaClientProvider from './masa-client-provider';
// import { queryClient } from '../masa-client/query-client';

// Commented the QueryClientProvider because we still need to test
// if the new implementation is working or not.
export const MasaStateProvider = ({ children }: { children: ReactNode }) => {
  return (
    // <QueryClientProvider client={queryClient}>
    <MasaClientProvider>{children}</MasaClientProvider>
    // </QueryClientProvider>
  );
};
