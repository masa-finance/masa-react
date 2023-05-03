import { Ethereum } from '@wagmi/connectors';

declare global {
  interface Window {
    ethereum?: Ethereum;
    RF?: {
      qualify: ({ code: string }) => void;
    };
  }
}
