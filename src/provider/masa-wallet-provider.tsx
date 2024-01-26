import React, { ReactNode } from 'react';

import WalletClientProvider from '../wallet-client/wallet-client-provider';

export const MasaWalletProvider = ({ children }: { children: ReactNode }) => (
  // <WagmiRainbowkitProvider>
  <WalletClientProvider>{children}</WalletClientProvider>
  // </WagmiRainbowkitProvider>
);
