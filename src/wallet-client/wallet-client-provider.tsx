import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { useWallet } from './wallet/use-wallet';
import { useNetwork } from './network/use-network';
import { useAccountChangeListen } from './wallet/use-account-change-listen';
import { useConfig } from '../base-provider';
import { getChainIdNetworkMap } from './utils';
import { useDebug } from '../hooks/use-debug';
import { useNetworkSwitchListen } from './network/use-network-switch-listen';

type WalletClientValue = ReturnType<typeof useWallet> &
  ReturnType<typeof useNetwork>;

export const WalletContext = createContext({} as WalletClientValue);

export interface WalletClientProps {
  children: ReactNode;
}

export const WalletClientProvider = ({ children }: WalletClientProps) => {
  const { forceChain } = useConfig();

  const {
    address,
    provider,
    signer,
    connector,
    isConnected,
    isConnecting,
    isDisconnected,
    openConnectModal,
    openChainModal,
    openAccountModal,
    disconnect,
    disconnectAsync,
    isLoadingSigner,
    isLoadingBalance,
    balance,
    previousAddress,
    setPreviousAddress,
  } = useWallet();
  const {
    connectors,
    switchNetwork,
    switchingToChain,
    stopSwitching,
    canProgrammaticallySwitchNetwork,
    activeChain,
    isSwitchingChain,
    chains,
    isActiveChainUnsupported,
    availableChains,
    pendingConnector,
    networkError,
  } = useNetwork();

  const onAccountChange = useCallback(() => console.log('account changed'), []);
  const onChainChange = useCallback(() => console.log('account changed'), []);

  useAccountChangeListen({
    onAccountChange,
    onChainChange,
  });

  useNetworkSwitchListen({
    activeConnector: connector,
    stopSwitching,
    networkError,
  });

  const chainIdsByNetwork = useMemo(() => {
    if (!chains || chains.length === 0) return {};

    return getChainIdNetworkMap([...chains, activeChain]);
  }, [chains, activeChain]);

  useEffect(() => {
    if (!forceChain) return;
    // * NOTE: comment the following 3 lines out to disable automatic network switching for forced network
    if (canProgrammaticallySwitchNetwork) {
      // switchNetwork?.(chainIdsByNetwork[forceChain] as number);
    }
  }, [
    forceChain,
    canProgrammaticallySwitchNetwork,
    // switchNetwork,
    chainIdsByNetwork,
    chains,
  ]);

  const walletClientValue = useMemo(
    () =>
      ({
        // wallet
        address,
        provider,
        signer,
        connector,
        isConnected,
        isConnecting,
        isDisconnected,
        openConnectModal,
        openChainModal,
        openAccountModal,
        disconnect,
        disconnectAsync,
        isLoadingSigner,
        isLoadingBalance,
        balance,
        previousAddress,
        setPreviousAddress,

        // network
        connectors,
        switchNetwork,
        switchingToChain,
        canProgrammaticallySwitchNetwork,
        activeChain,
        isSwitchingChain,
        chains,
        isActiveChainUnsupported,
        availableChains,
        pendingConnector,
      }) as WalletClientValue,
    [
      // wallet
      address,
      provider,
      signer,
      connector,
      isConnected,
      isConnecting,
      isDisconnected,
      openConnectModal,
      openChainModal,
      openAccountModal,
      disconnect,
      disconnectAsync,
      isLoadingSigner,
      isLoadingBalance,
      balance,
      previousAddress,
      setPreviousAddress,

      // network
      connectors,
      switchNetwork,
      switchingToChain,
      canProgrammaticallySwitchNetwork,
      activeChain,
      isSwitchingChain,
      chains,
      isActiveChainUnsupported,
      availableChains,
      pendingConnector,
    ]
  );

  useDebug({ name: 'WalletClientProvider', value: walletClientValue }, []);

  return (
    <WalletContext.Provider value={walletClientValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletClient = (): WalletClientValue =>
  useContext(WalletContext);

export default WalletClientProvider;
