import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';

// TODO: Consider importing the client from `masa-client/query-client`
const client = new QueryClient();

const MasaWagmiRainbowkitProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default MasaWagmiRainbowkitProvider;
