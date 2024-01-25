import React, { ReactNode } from 'react';
import WagmiRainbowkitProvider from '../wallet-client/wagmi-rainbowkit-provider';
import WalletClientProvider from '../wallet-client/wallet-client-provider';

export const MasaWalletProvider = ({ children }: { children: ReactNode }) => (
  // <WagmiRainbowkitProvider>
    <WalletClientProvider>{children}</WalletClientProvider>
  // </WagmiRainbowkitProvider>
);
