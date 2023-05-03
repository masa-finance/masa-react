import { MetaMaskInpageProvider } from '@metamask/providers';
import { Ethereum } from '@wagmi/core';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider | Ethereum;
    RF?: {
      qualify: ({ code: string }) => void;
    };
  }
}
