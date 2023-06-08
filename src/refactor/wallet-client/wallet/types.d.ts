import type { Provider } from '@wagmi/core';
import type { Signer } from 'ethers';

export type UseWalletReturnType = {
  address: `0x${string}` | undefined;
  provider: Provider;
  signer: Signer | undefined;
};
