import type { Provider } from '@wagmi/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useSwitchNetwork,
  useNetwork as useNetworkWagmi,
  useAccount,
  useConnect,
} from 'wagmi';

export const useNetwork = () => {
  const { switchNetwork: switchNetworkWagmi, error: networkError } =
    useSwitchNetwork();
  const { connector: activeConnector } = useAccount();
  const { connectors, pendingConnector } = useConnect();
  const { chains, chain: activeChain } = useNetworkWagmi();
  const [switchingToChain, setSwitchingToChain] = useState<number | null>();

  const availibleChains = useMemo(
    () => connectors.flatMap((c) => c.chains),
    [connectors]
  );

  const isSwitchingChain = useMemo(
    () => !!switchingToChain,
    [switchingToChain]
  );
  const isActiveChainUnsupported = activeChain?.unsupported ?? false;

  const switchNetwork = useCallback(
    (chainId?: number) => {
      setSwitchingToChain(chainId);
      if (!chainId) return;
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
    connectors,
    switchNetwork,
    switchingToChain,
    canProgramaticallySwitchNetwork,
    activeChain,
    isSwitchingChain,
    chains,
    availibleChains,
    pendingConnector,
    isActiveChainUnsupported,
  };
};
