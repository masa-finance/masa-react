import {
  getNetworkNameByChainId,
  Network,
  NetworkName,
  SupportedNetworks,
} from '@masa-finance/masa-sdk';
import type { Chain, GetNetworkResult } from '@wagmi/core';
import type { Connector } from 'wagmi';
import {
  useAccount,
  useConnect,
  useNetwork as useNetworkWagmi,
  useChainId,
  useSwitchChain,
  useSwitchChain as useSwitchNetworkWagmi,
} from 'wagmi';

import { useCallback, useMemo, useState } from 'react';

export const useNetwork = () => {
  const {
    switchChain: switchNetworkWagmi,
    error: networkError,
    switchChainAsync: switchNetworkAsync,
    isPending: isSwitchingWagmi,
  } = useSwitchChain();
  const { connectors, pendingConnector } = useConnect();
  const { connector: activeConnector, chain: activeChain } = useAccount();
  const { chains } = useNetworkWagmi();
  const network = useNetworkWagmi();
  const [switchingToChain, setSwitchingToChain] = useState<number | null>();
  const stopSwitching = useCallback(() => {
    setSwitchingToChain(null);
  }, []);

  const availableChains: Chain[] = useMemo(
    () => connectors.flatMap((connector: Connector) => connector.chains),
    [connectors]
  );

  const isSwitchingChain: boolean = useMemo(
    () => !!switchingToChain || isSwitchingWagmi,
    [switchingToChain, isSwitchingWagmi]
  );

  const isActiveChainUnsupported = activeChain?.unsupported ?? false;

  const switchNetwork = useCallback(
    (chainId?: number) => {
      try {
        if (!chainId) return;
        setSwitchingToChain(chainId);
        switchNetworkWagmi?.({ chainId });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`switching networks failed! ${error.message}`);
        }

        throw error;
      }
    },
    [switchNetworkWagmi]
  );

  const switchNetworkByName = useCallback(
    (networkName: NetworkName) => {
      try {
        const networkToSwitchTo = SupportedNetworks[networkName];
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
        throw error;
      }
    },
    [activeChain?.id, switchNetworkWagmi, stopSwitching]
  );

  // const activeChainId = useMemo(() => activeChain?.id, [activeChain]);
  // const activeNetwork = useMemo(() => activeChain?.network, [activeChain]);
  const currentNetwork = useMemo(() => {
    const nw = activeChain?.id;

    if (!nw) return undefined;
    const newNetwork = getNetworkNameByChainId(nw ?? 0);

    return SupportedNetworks[newNetwork];
  }, [activeChain]);

  const currentNetworkByChainId = useMemo(() => {
    if (!activeChainId) return undefined;
    return getNetworkNameByChainId(activeChainId);
  }, [activeChainId]);

  const canProgrammaticallySwitchNetwork = useMemo(
    () => !!switchNetwork || activeConnector?.name === 'WalletConnect',
    [switchNetwork, activeConnector]
  );

  return {
    connectors: connectors as unknown,
    switchNetwork,
    switchNetworkAsync,
    switchNetworkByName,
    switchingToChain,
    canProgrammaticallySwitchNetwork,
    activeChain,
    activeNetwork,
    activeChainId,
    isSwitchingChain,
    chains,
    availableChains,
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
    canProgrammaticallySwitchNetwork: boolean;
    activeChain:
      | (Chain & {
          unsupported?: boolean | undefined;
        })
      | undefined;
    activeNetwork: string;
    activeChainId: number;
    isSwitchingChain: boolean;
    chains: Chain[];
    availableChains: Chain[];
    pendingConnector?: Connector;
    isActiveChainUnsupported: boolean;

    currentNetwork: Network | undefined;
    currentNetworkNew: GetNetworkResult;
    stopSwitching: () => void;
    networkError: Error | null;
  };
};
