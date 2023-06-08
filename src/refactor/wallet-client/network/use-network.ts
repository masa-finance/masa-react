import type { Provider } from '@wagmi/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useSwitchNetwork,
  useNetwork as useNetworkWagmi,
  useAccount,
} from 'wagmi';

export const useNetwork = () => {
  const { switchNetwork: switchNetworkWagmi, error: networkError } =
    useSwitchNetwork();
  const { connector: activeConnector } = useAccount();
  const { chains, chain: activeChain } = useNetworkWagmi();
  const [switchingToChain, setSwitchingToChain] = useState<number | null>();
  console.log({ switchingToChain });
  const isSwitchingChain = useMemo(
    () => !!switchingToChain,
    [switchingToChain]
  );
  const isActiveChainUnsupported = activeChain?.unsupported ?? false;

  const switchNetwork = useCallback(
    (chainId: number) => {
      setSwitchingToChain(chainId);
      switchNetworkWagmi?.(chainId);
    },
    [switchNetworkWagmi]
  );

  const stopSwitching = useCallback(() => {
    setSwitchingToChain(null);
    // onClose();
  }, []);

  useEffect(() => {
    if (!activeConnector) {
      return undefined;
    }

    // const stopSwitchingHandle = () => {
    //   setSwitchingToChain(null);
    // };

    let provider: Provider;

    activeConnector
      ?.getProvider?.()
      .then((provider_: Provider) => {
        provider = provider_;
        provider.on('chainChanged', stopSwitching);
      })
      .catch((error: unknown) => {
        console.log("error getting provider's chainChanged event", error);
      });

    return () => {
      provider?.removeListener('chainChanged', stopSwitching);
    };
  }, [activeConnector, stopSwitching]);

  useEffect(() => {
    if (networkError && networkError.name === 'UserRejectedRequestError') {
      stopSwitching();
    }
  }, [networkError, stopSwitching]);

  const canProgramaticallySwitchNetwork = useMemo(
    () => !!switchNetwork,
    [switchNetwork]
  );

  return {
    switchNetwork,
    switchingToChain,
    canProgramaticallySwitchNetwork,
    activeChain,
    isSwitchingChain,
    chains,
    isActiveChainUnsupported,
  };
};
