import {
  NetworkName,
  SupportedNetworks,
  getNetworkNameByChainId,
} from '@masa-finance/masa-sdk';
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
  const network = useNetworkWagmi();
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

  const switchNetworkByName = useCallback(
    (forcedNetworkParam: NetworkName) => {
      const networkToSwitchTo = SupportedNetworks[forcedNetworkParam];
      setSwitchingToChain(networkToSwitchTo?.chainId);
      if (networkToSwitchTo) {
        if (networkToSwitchTo.chainId === activeChain?.id) {
          return;
        }
        switchNetworkWagmi?.(networkToSwitchTo.chainId);
      }
    },
    [activeChain?.id, switchNetworkWagmi]
  );

  const activeChainId = useMemo(() => activeChain?.id, [activeChain]);
  const activeNetwork = useMemo(() => activeChain?.network, [activeChain]);
  const currentNetwork = useMemo(() => {
    let nw = activeChain?.network;
    // * NOTE: name mismatch from masa & wagmi
    if (nw === 'celo-alfajores') {
      nw = 'alfajores';
    }

    return SupportedNetworks[nw as NetworkName];
  }, [activeChain]);

  const currentNetworkByChainId = useMemo(() => {
    if (!activeChainId) return 0;
    return getNetworkNameByChainId(activeChainId);
  }, [activeChainId]);

  const stopSwitching = useCallback(() => {
    setSwitchingToChain(null);
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
    switchNetworkByName,
    switchingToChain,
    canProgramaticallySwitchNetwork,
    activeChain,
    activeNetwork,
    activeChainId,
    isSwitchingChain,
    chains,
    availibleChains,
    pendingConnector,
    isActiveChainUnsupported,

    // * old
    currentNetwork,
    currentNetworkByChainId,
    currentNetworkNew: network,
  };
};
