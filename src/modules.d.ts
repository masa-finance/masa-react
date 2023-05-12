import './index';

declare global {
  interface Window {
    RF?: {
      qualify: ({ code: string }) => void;
    };
  }
}
