import {
  getNetworkNameByChainId,
  Network,
  NetworkName,
  SupportedNetworks,
} from '@masa-finance/masa-sdk';
import type { Chain } from 'viem';
import {
  Config,
  useAccount,
  useConfig,
  useConnect,
  useSwitchChain,
} from 'wagmi';
import { useCallback, useMemo, useState } from 'react';
import { SwitchChainMutateAsync } from 'wagmi/query';
import { SwitchChainErrorType } from '@wagmi/core';

export const useNetwork = (): {
  connectors: unknown;
  switchNetwork: (chainId?: number) => void;
  switchNetworkAsync: SwitchChainMutateAsync<Config, unknown>;
  switchNetworkByName: (networkName: NetworkName) => void;
  switchingToChain: number | null | undefined;
  canProgrammaticallySwitchNetwork: boolean;
  activeChain: Chain | undefined;
  activeChainId: number | undefined;
  isSwitchingChain: boolean;
  chains: readonly [Chain, ...Chain[]];
  availableChains: Chain[];

  isActiveChainUnsupported: boolean;
  stopSwitching: () => void;
  networkError: SwitchChainErrorType | null;
  // * old
  currentNetwork: Network | undefined;
  currentNetworkByChainId: NetworkName | undefined;
} => {
  const {
    switchChain: switchNetworkWagmi,
    error: networkError,
    switchChainAsync: switchNetworkAsync,
    isPending: isSwitchingWagmi,
  } = useSwitchChain();

  const { connectors } = useConnect();
  const { connector: activeConnector, chain: activeChain } = useAccount();
  const { chains } = useConfig();
  // const network = useNetworkWagmi();
  const [switchingToChain, setSwitchingToChain] = useState<number | null>();
  const stopSwitching = useCallback(() => {
    setSwitchingToChain(null);
  }, []);

  const availableChains: Chain[] = useMemo(() => [...chains], [chains]);

  const isSwitchingChain: boolean = useMemo(
    () => !!switchingToChain || isSwitchingWagmi,
    [switchingToChain, isSwitchingWagmi]
  );

  const isActiveChainUnsupported = false; // activeChain?.unsupported ?? false;

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
            stopSwitching();
            return;
          }
          switchNetworkWagmi?.({ chainId: networkToSwitchTo.chainId });
          stopSwitching();
        }
      } catch (error: unknown) {
        stopSwitching();
        throw error;
      }
    },
    [activeChain?.id, switchNetworkWagmi, stopSwitching]
  );

  const activeChainId = useMemo(() => activeChain?.id, [activeChain]);
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
    activeChainId,
    isSwitchingChain,
    chains,
    availableChains,

    isActiveChainUnsupported,
    stopSwitching,
    networkError,

    // * old
    currentNetwork,
    currentNetworkByChainId,
  };
};
