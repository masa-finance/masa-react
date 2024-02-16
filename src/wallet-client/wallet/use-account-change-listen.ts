import { useAsync } from 'react-use';
import { useAccount } from 'wagmi';

import { useEthersProvider } from '../helpers/ethers';

export const useAccountChangeListen = ({
  onAccountChange,
  onChainChange,
}: Partial<{
  onAccountChange?: (account: `0x${string}`) => void;
  onChainChange?: () => void;
}>) => {
  const provider = useEthersProvider();
  const { connector } = useAccount();

  useAsync(async () => {
    const onChangeConnector = async ({
      chainId,
      accounts,
    }: {
      accounts?: readonly `0x${string}`[] | undefined;
      chainId?: number | undefined;
    } & { uid: string }) => {
      if (accounts && accounts.length > 0) {
        // NOTE: this is a hack to fix the walletconnect issue
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('walletconnect');
        }

        console.log('accchange', { accounts });
        onAccountChange?.(accounts[0]);
      } else if (chainId) {
        // NOTE: this is a hack to fix the walletconnect issue
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('walletconnect');
        }
        onChainChange?.();
      }
    };

    const onDisconnectConnector = async () => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('walletconnect');
      }
      await Promise.resolve();
    };

    connector?.emitter.on('change', onChangeConnector);
    connector?.emitter.on('disconnect', onDisconnectConnector);
    // * walletconnect

    const onAccountsChanged = async (accounts: string[]) => {
      await Promise.resolve();
      console.log('for wc acc changed', accounts);
    };

    const onChainChanged = async (chainId: number) => {
      await Promise.resolve();
      console.log('for wc chain changed', chainId);
    };

    const onDisconnect = async (code: number, reason: string) => {
      await Promise.resolve();
      console.log('for wc disc', code, reason);
    };
    // Subscribe to accounts change
    provider?.on('accountsChanged', onAccountsChanged);

    // Subscribe to chainId change
    provider?.on('chainChanged', onChainChanged);

    // Subscribe to session disconnection
    provider?.on('disconnect', onDisconnect);

    await Promise.resolve();

    return () => {
      connector?.emitter.off('change', onChangeConnector);
      connector?.emitter.off('disconnect', onDisconnectConnector);
      provider?.off('accountsChanged', onAccountsChanged);
      provider?.off('chainChanged', onChainChanged);
      provider?.off('disconnect', onDisconnect);
    };
  }, [onAccountChange, onChainChange, connector, provider]);
};
