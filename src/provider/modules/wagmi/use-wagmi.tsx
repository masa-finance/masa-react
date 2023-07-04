// import { Ethereum } from '@wagmi/connectors';
// import {
//   Address,
//   TypedData,
//   TypedDataToPrimitiveTypes,
//   TypedDataDomain,
//   ResolvedConfig,
// } from 'abitype';
import {
  // BigNumber,
  // providers,
  // Signer as Signer$1,
  Signer,
  Wallet,
} from 'ethers';

import {
  Chain,
  useAccount,
  useDisconnect,
  useNetwork,
  useProvider,
  useSigner,
  useSwitchNetwork,
} from 'wagmi';
import { useEffect } from 'react';

// type WebSocketProvider = providers.WebSocketProvider & {
//   chains?: Chain[];
// };

// import 'wagmi/node_modules/@wagmi/core/dist/index-35b6525c';
// import type { F } from 'wagmi';
// import { type WebSocketProvider } from '@wagmi/core';

export const useWagmi = ({
  setSigner,
  logout,
}: {
  setSigner: (signer?: Signer) => void;
  logout: () => void;
}) => {
  const provider = useProvider();
  const { chain, chains } = useNetwork();
  const { isLoading: isLoadingNetwork, status } = useSwitchNetwork();

  const {
    data: signer,
    isError: isSignerError,
    isLoading: isSignerLoading,
  } = useSigner<Wallet>();

  const { isConnecting, isDisconnected, isReconnecting } = useAccount({
    onDisconnect: () => logout(),
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isReconnecting || isSignerLoading) {
      return;
    }

    setSigner(signer as Wallet);
  }, [
    setSigner,
    chain,
    signer,
    isLoadingNetwork,
    status,
    isReconnecting,
    provider,
    isSignerLoading,
  ]);

  return {
    isLoading: isSignerLoading,
    isError: isSignerError,
    isConnecting,
    isDisconnected,
    provider,
    signer: signer as Signer,
    chain: chain as Chain,
    chains,
    disconnect,
  } as {
    isLoading: boolean;
    isError: boolean;
    isConnecting: boolean;
    signer: Signer;
    chain: Chain;
    chains: Chain[];
    disconnect: () => void;
  };
};

// export { type Provider, type Signer } from '@wagmi/core';
// export { type WebSocketProvider };
// export { type ChainProviderFn, type Chain } from 'wagmi';
