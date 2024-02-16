import React, { ReactNode } from 'react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import MasaClientProvider from './masa-client-provider';
import { useConfig } from '../base-provider';

export const MasaStateProvider = ({ children }: { children: ReactNode }) => {
  const { rainbowkitConfig } = useConfig();
  return (
    <RainbowKitProvider modalSize={rainbowkitConfig?.modalSize}>
      <MasaClientProvider>{children}</MasaClientProvider>
    </RainbowKitProvider>
  );
};
