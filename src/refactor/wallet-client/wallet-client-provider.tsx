import React, {
  ReactNode,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { useWallet } from './wallet/use-wallet';
import { useNetwork } from './network/use-network';
import { useAccountChangeListen } from './wallet/use-account-change-listen';

type WalletClientValue = ReturnType<typeof useWallet> &
  ReturnType<typeof useNetwork>;

export const WalletContext = createContext({} as WalletClientValue);

export interface WalletClientProps {
  children: ReactNode;
}

export const WalletClientProvider = ({ children }: WalletClientProps) => {
  const {
    address,
    provider,
    signer,
    connector,
    isConnected,
    isConnecting,
    isDisconnected,
    openConnectModal,
    disconnect,
    disconnectAsync,
    isLoadingSigner,
  } = useWallet();
  const {
    switchNetwork,
    switchingToChain,
    canProgramaticallySwitchNetwork,
    activeChain,
    isSwitchingChain,
    chains,
    isActiveChainUnsupported,
  } = useNetwork();

  const onAccountChange = useCallback(() => console.log('account changed'), []);
  const onChainChange = useCallback(() => console.log('account changed'), []);

  useAccountChangeListen({
    onAccountChange,
    onChainChange,
  });

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
        disconnect,
        disconnectAsync,
        isLoadingSigner,

        // network
        switchNetwork,
        switchingToChain,
        canProgramaticallySwitchNetwork,
        activeChain,
        isSwitchingChain,
        chains,
        isActiveChainUnsupported,
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
      disconnect,
      disconnectAsync,
      isLoadingSigner,

      // network
      switchNetwork,
      switchingToChain,
      canProgramaticallySwitchNetwork,
      activeChain,
      isSwitchingChain,
      chains,
      isActiveChainUnsupported,
    ]
  );

  return (
    <WalletContext.Provider value={walletClientValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletClient = (): WalletClientValue =>
  useContext(WalletContext);

export default WalletClientProvider;
