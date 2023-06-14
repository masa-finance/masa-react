import { useAsync } from 'react-use';
import { ConnectorData, useAccount, useProvider } from 'wagmi';

export const useAccountChangeListen = ({
  onAccountChange,
  onChainChange,
}: Partial<{
  onAccountChange?: () => void;
  onChainChange?: () => void;
}>) => {
  const provider = useProvider();
  const { connector } = useAccount();

  useAsync(async () => {
    const handleConnectorUpdate = async ({ chain, account }: ConnectorData) => {
      if (account) {
        // setAccountAddress(account);

        // NOTE: this is a hack to fix the walletconnect issue
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('walletconnect');
        }

        onAccountChange?.();
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

    connector?.on('change', handleConnectorUpdate);
    connector?.on('disconnect', async () => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('walletconnect');
      }

      //   await invalidateAllQueries({
      //     masa,
      //     signer,
      //     walletAddress: accountAddress,
      //   });
    });
    // * walletconnect

    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts: string[]) => {
      console.log('for wc acc changed', accounts);
    });

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId: number) => {
      console.log('for wc chainid changed', chainId);
    });

    // Subscribe to session disconnection
    provider.on('disconnect', (code: number, reason: string) => {
      console.log('for wc disc', code, reason);
    });

    return () => {
      connector?.off('change', handleConnectorUpdate);
      provider.off('accountsChanged', () => {});
      provider.off('chainChanged', () => {});
      provider.off('disconnect', () => {});
    };
  }, [onAccountChange, onChainChange, connector, provider]);
};
