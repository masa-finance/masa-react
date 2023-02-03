import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo } from 'react';
import { queryClient } from './masa-provider';
import { useMasa } from './use-masa';

export const useMetamask = ({ disable }: { disable?: boolean }) => {
  const { setProvider, setMissingProvider, handleLogout } = useMasa();

  const provider = useMemo(() => {
    if (typeof window !== 'undefined') {
      //@ts-ignore
      if (typeof window?.ethereum !== 'undefined') {
        //@ts-ignore
        return new ethers.providers.Web3Provider(window?.ethereum);
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

  const accountChangedHandler = useCallback(
    async (newAccount) => {
      if (setProvider) setProvider(newAccount);
    },
    [setProvider]
  );

  const connect = useCallback(async () => {
    console.log('DISABLE', disable);
    if (!disable) {
      //@ts-ignore
      if (provider && window?.ethereum) {
        await provider.send('eth_requestAccounts', []);

        await accountChangedHandler(provider.getSigner(0));
        if (provider && setProvider) {
          setProvider(provider.getSigner(0));
          onConnect();
        }
      }
    }
  }, [accountChangedHandler, setProvider, provider, disable]);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        console.log('CALLING RECONNECT');
        try {
          await connect();
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    void connectWalletOnPageLoad();
  }, [connect]);

  const onConnect = () => {
    localStorage.setItem('isWalletConnected', 'true');
  };

  const disconnect = useCallback(async () => {
    await handleLogout?.();
    localStorage.setItem('isWalletConnected', 'false');
    setProvider?.(null);
  }, [handleLogout, setProvider]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      //@ts-ignore
      window?.ethereum?.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          setProvider?.(null);
          await handleLogout?.();
          await disconnect();
          queryClient.invalidateQueries('wallet');
        }
      });

      //@ts-ignore
      window?.ethereum?.on('networkChanged', async (accounts) => {
        //@ts-ignore
        const newProvider = new ethers.providers.Web3Provider(window?.ethereum);
        if (newProvider) {
          await newProvider.send('eth_requestAccounts', []);

          await accountChangedHandler(newProvider.getSigner(0));
          if (newProvider && setProvider) {
            setProvider(newProvider.getSigner(0));
            onConnect();
          }
          queryClient.invalidateQueries('wallet');
        }
      });
    }
  }, [handleLogout, disconnect, setProvider]);

  return { connect };
};
