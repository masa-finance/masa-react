import {
  Network,
  NetworkName,
  SupportedNetworks,
  getNetworkNameByChainId,
} from '@masa-finance/masa-sdk';
import type { Chain, GetNetworkResult } from '@wagmi/core';
import type { Connector } from 'wagmi';

import { useCallback, useMemo, useState } from 'react';
import {
  useSwitchNetwork,
  useNetwork as useNetworkWagmi,
  useConnect,
  useAccount,
} from 'wagmi';

export const useNetwork = () => {
  const {
    switchNetwork: switchNetworkWagmi,
    error: networkError,
    switchNetworkAsync,
  } = useSwitchNetwork();
  const { connectors, pendingConnector } = useConnect();
  const { connector: activeConnector } = useAccount();
  const { chains, chain: activeChain } = useNetworkWagmi();
  const network = useNetworkWagmi();
  const [switchingToChain, setSwitchingToChain] = useState<number | null>();
  const stopSwitching = useCallback(() => {
    setSwitchingToChain(null);
  }, []);

  const availibleChains = useMemo(
    () => connectors.flatMap((c: Connector) => c.chains),
    [connectors]
  );

  const isSwitchingChain = useMemo(
    () => !!switchingToChain,
    [switchingToChain]
  );

  const isActiveChainUnsupported = activeChain?.unsupported ?? false;

  const switchNetwork = useCallback(
    (chainId?: number) => {
      try {
        if (!chainId) return;
        setSwitchingToChain(chainId);
        switchNetworkWagmi?.(chainId);
      } catch (error: unknown) {
        throw error as Error;
      }
    },
    [switchNetworkWagmi]
  );

  const switchNetworkByName = useCallback(
    (forcedNetworkParam: NetworkName) => {
      try {
        const networkToSwitchTo = SupportedNetworks[forcedNetworkParam];
        setSwitchingToChain(networkToSwitchTo?.chainId);

        if (networkToSwitchTo) {
          if (networkToSwitchTo.chainId === activeChain?.id) {
            if (switchNetworkWagmi) stopSwitching();
            return;
          }
          switchNetworkWagmi?.(networkToSwitchTo.chainId);
          if (switchNetworkWagmi) stopSwitching();
        }
      } catch (error: unknown) {
        if (switchNetworkWagmi) stopSwitching();
        throw error as Error;
      }
    },
    [activeChain?.id, switchNetworkWagmi, stopSwitching]
  );

  const activeChainId = useMemo(() => activeChain?.id, [activeChain]);
  const activeNetwork = useMemo(() => activeChain?.network, [activeChain]);
  const currentNetwork = useMemo(() => {
    const nw = activeChain?.id;
    // // * NOTE: name mismatch from masa & wagmi
    // if (nw === 'celo-alfajores') {
    //   nw = 'alfajores';
    // }

    if (!nw) return undefined;
    const newNetwork = getNetworkNameByChainId(nw ?? 0);

    return SupportedNetworks[newNetwork];
  }, [activeChain]);

  const currentNetworkByChainId = useMemo(() => {
    if (!activeChainId) return undefined;
    return getNetworkNameByChainId(activeChainId);
  }, [activeChainId]);

  // useEffect(() => {
  //   if (!activeConnector) {
  //     return undefined;
  //   }

  //   let provider: Provider;

  //   activeConnector
  //     ?.getProvider?.()
  //     .then((provider_: Provider) => {
  //       provider = provider_;
  //       provider.on('chainChanged', stopSwitching);
  //     })
  //     .catch((error: unknown) => {
  //       console.log("error getting provider's chainChanged event", error);
  //     });

  //   return () => {
  //     provider?.removeListener('chainChanged', stopSwitching);
  //   };
  // }, [activeConnector, stopSwitching]);

  // useEffect(() => {
  //   if (networkError && networkError.name === 'UserRejectedRequestError') {
  //     stopSwitching();
  //   }
  // }, [networkError, stopSwitching]);

  const canProgramaticallySwitchNetwork = useMemo(
    () => !!switchNetwork || activeConnector?.name === 'WalletConnect',
    [switchNetwork, activeConnector]
  );

  return {
    connectors: connectors as unknown,
    switchNetwork,
    switchNetworkAsync,
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
    stopSwitching,
    networkError,
    // * old
    currentNetwork,
    currentNetworkByChainId,
    currentNetworkNew: network,
  } as {
    connectors?: Connector[];
    switchNetwork?: (chainId?: number) => void;
    switchNetworkAsync?:
      | ((chainId_?: number | undefined) => Promise<Chain>)
      | undefined;
    switchNetworkByName: (forcedNetworkParam: NetworkName) => void;
    switchingToChain: number | null | undefined;
    canProgramaticallySwitchNetwork: boolean;
    activeChain:
      | (Chain & {
          unsupported?: boolean | undefined;
        })
      | undefined;
    activeNetwork: string;
    activeChainId: number;
    isSwitchingChain: boolean;
    chains: Chain[];
    availibleChains: Chain[];
    pendingConnector?: Connector;
    isActiveChainUnsupported: boolean;

    currentNetwork: Network | undefined;
    currentNetworkNew: GetNetworkResult;
    stopSwitching: () => void;
    networkError: Error | null;
  };
};