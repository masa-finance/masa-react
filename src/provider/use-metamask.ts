import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { queryClient } from './masa-query-client';
import { useMasa } from './use-masa';

export const useMetamask = ({
  disable,
}: {
  disable?: boolean;
}): { connect: () => void } => {
  const [walletsConnected, setWalletsConnected] = useState<string[]>([]);
  const { setProvider, setMissingProvider, handleLogout } = useMasa();

  const provider = useMemo(() => {
    if (typeof window !== 'undefined') {
      if (typeof window?.ethereum !== 'undefined') {
        return new ethers.providers.Web3Provider(
          window?.ethereum as unknown as ethers.providers.ExternalProvider
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, []);

  useEffect(() => {
    if (setMissingProvider) {
      if (provider) {
        setMissingProvider(false);
      } else {
        setMissingProvider(true);
      }
    }
  }, [provider, setMissingProvider]);

  const connect = useCallback(async () => {
    console.log('DISABLE', disable);
    if (!disable) {
      if (provider && window?.ethereum) {
        await provider.send('eth_requestAccounts', []);

        const signer = provider.getSigner(0);
        if (signer && setProvider) {
          setProvider(signer);
          onConnect();
        }
      }
    }
  }, [setProvider, provider, disable]);

  useEffect(() => {
    const connectWalletOnPageLoad = async (): Promise<void> => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await connect();
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    void connectWalletOnPageLoad();
  }, [connect]);

  const onConnect = (): void => {
    localStorage.setItem('isWalletConnected', 'true');
  };

  const disconnect = useCallback(async () => {
    await handleLogout?.();
    localStorage.setItem('isWalletConnected', 'false');
    setProvider?.(null);
  }, [handleLogout, setProvider]);

  const detectWalletChange = useCallback(async () => {
    const deduplicatedWallets = [...new Set(walletsConnected)];
    console.log({ deduplicatedWallets });
    if (deduplicatedWallets.length > 1) {
      await disconnect();
      await queryClient.invalidateQueries('wallet');
      await queryClient.invalidateQueries('session');
    }
  }, [[walletsConnected, handleLogout, disconnect]]);

  useEffect(() => {
    detectWalletChange();
  }, [detectWalletChange]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window?.ethereum?.on(
        'accountsChanged',
        async (accounts): Promise<void> => {
          const accs = accounts as string[];
          if ((accs.length as number) === 0) {
            disconnect();
            setWalletsConnected([]);
          } else {
            setWalletsConnected([...walletsConnected, ...accs]);
          }
        }
      );

      window?.ethereum?.on('networkChanged', async () => {
        const newProvider = new ethers.providers.Web3Provider(
          window?.ethereum as never
        );
        if (newProvider) {
          await newProvider.send('eth_requestAccounts', []);

          const signer = newProvider.getSigner(0);
          if (signer && setProvider) {
            setProvider(signer);
            onConnect();
          }
          await queryClient.invalidateQueries('wallet');
        }
      });
    }
  }, [handleLogout, disconnect, setProvider, walletsConnected]);

  return { connect };
};
