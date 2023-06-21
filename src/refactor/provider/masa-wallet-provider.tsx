import React, { ReactNode } from 'react';
import type { QueryClient } from '@tanstack/react-query';

import WagmiRainbowkitProvider from '../wallet-client/wagmi-rainbowkit-provider';
import WalletClientProvider from '../wallet-client/wallet-client-provider';

export const MasaQueryClientContext = React.createContext<
  QueryClient | undefined
>(undefined);

export const MasaWalletProvider = ({ children }: { children: ReactNode }) => (
  <WagmiRainbowkitProvider>
    <WalletClientProvider>{children}</WalletClientProvider>
  </WagmiRainbowkitProvider>
);
