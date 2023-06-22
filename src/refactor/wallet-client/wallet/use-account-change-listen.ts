import { useAsync } from 'react-use';
import { ConnectorData, useAccount, useProvider } from 'wagmi';

export const useAccountChangeListen = ({
  onAccountChange,
  onChainChange,
}: Partial<{
  onAccountChange?: (account: `0x${string}`) => void;
  onChainChange?: () => void;
}>) => {
  const provider = useProvider();
  const { connector } = useAccount();

  useAsync(async () => {
    const onChangeConnector = async ({ chain, account }: ConnectorData) => {
      if (account) {
        // setAccountAddress(account);

        // NOTE: this is a hack to fix the walletconnect issue
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('walletconnect');
        }

        onAccountChange?.(account);
      } else if (chain) {
        // NOTE: this is a hack to fix the walletconnect issue
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('walletconnect');
        }
        await Promise.all([
          //   invalidateIdentity({ masa, signer, walletAddress }),
          //   invalidateCreditScores({ masa, signer, walletAddress }),
          //   invalidateGreen({ masa, signer, walletAddress }),
          //   invalidateCustomSBTs(),
          //   invalidateCustomSBTContracts(),
        ]);
        onChainChange?.();
      }
    };

    const onDisconnectConnector = async () => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('walletconnect');
      }
    };

    connector?.on('change', onChangeConnector);
    connector?.on('disconnect', onDisconnectConnector);
    // * walletconnect

    const onAccountsChanged = async (accounts: string[]) => {
      await Promise.resolve();
      console.log('for wc acc changed', accounts);
    };

    const onChainChanged = async (chainId: number) => {
      console.log('for wc chain changed', chainId);
      await Promise.resolve();
    };

    const onDisconnect = async (code: number, reason: string) => {
      console.log('for wc disc', code, reason);
      await Promise.resolve();
    };
    // Subscribe to accounts change
    provider.on('accountsChanged', onAccountsChanged);

    // Subscribe to chainId change
    provider.on('chainChanged', onChainChanged);

    // Subscribe to session disconnection
    provider.on('disconnect', onDisconnect);

    return () => {
      connector?.off('change', onChangeConnector);
      connector?.off('disconnect', onDisconnectConnector);
      provider.off('accountsChanged', onAccountsChanged);
      provider.off('chainChanged', onChainChanged);
      provider.off('disconnect', onDisconnect);
    };
  }, [onAccountChange, onChainChange, connector, provider]);
};
