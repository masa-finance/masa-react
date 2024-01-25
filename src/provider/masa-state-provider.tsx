import React, { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import MasaClientProvider from './masa-client-provider';
import { queryClient } from '../masa-client/query-client';
import WagmiRainbowkitProvider from '../wallet-client/wagmi-rainbowkit-provider';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useConfig } from '../base-provider';

export const MasaStateProvider = ({ children }: { children: ReactNode }) => {
  const { rainbowkitConfig } = useConfig();
  return (
    <WagmiRainbowkitProvider>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize={rainbowkitConfig?.modalSize}>
          <MasaClientProvider>{children}</MasaClientProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiRainbowkitProvider>
  );
};
