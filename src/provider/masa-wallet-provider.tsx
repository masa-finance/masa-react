import React, { ReactNode } from 'react';

import WalletClientProvider from '../wallet-client/wallet-client-provider';
import MasaUpdatedProvider from '../MasaUpdatedProvider';

export const MasaWalletProvider = ({ children }: { children: ReactNode }) => (
  <MasaUpdatedProvider>
    <WalletClientProvider>{children}</WalletClientProvider>
  </MasaUpdatedProvider>
);
