import React, {
  ReactNode,
  useCallback,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from 'react';

import type { Chain } from 'wagmi';
import { useWallet } from './wallet/use-wallet';
import { useNetwork } from './network/use-network';
import { useAccountChangeListen } from './wallet/use-account-change-listen';
import { useConfig } from '../base-provider';
import { getChainIdNetworkMap } from './utils';
import { useDebug } from '../hooks/use-debug';

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
    canProgramaticallySwitchNetwork,
    activeChain,
    isSwitchingChain,
    chains,
    isActiveChainUnsupported,
    availibleChains,
    pendingConnector,
  } = useNetwork();

  const onAccountChange = useCallback(() => console.log('account changed'), []);
  const onChainChange = useCallback(() => console.log('account changed'), []);

  useAccountChangeListen({
    onAccountChange,
    onChainChange,
  });

  const chainIdsByNetwork = useMemo(() => {
    if (!chains || chains.length === 0) return {};

    return getChainIdNetworkMap([...chains, activeChain as Chain]);
  }, [chains, activeChain]);

  useEffect(() => {
    if (!forceChain) return;
    if (canProgramaticallySwitchNetwork) {
      switchNetwork?.(chainIdsByNetwork[forceChain] as number);
    }
  }, [
    forceChain,
    canProgramaticallySwitchNetwork,
    switchNetwork,
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
        canProgramaticallySwitchNetwork,
        activeChain,
        isSwitchingChain,
        chains,
        isActiveChainUnsupported,
        availibleChains,
        pendingConnector,
      } as WalletClientValue),
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
      canProgramaticallySwitchNetwork,
      activeChain,
      isSwitchingChain,
      chains,
      isActiveChainUnsupported,
      availibleChains,
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
