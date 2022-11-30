import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo } from 'react';
import { useMasa } from './use-masa';

const DEFAULT_RPC = 'https://rpc.ankr.com/eth_goerli';

export const useMetamask = () => {
  const { setProvider, masa } = useMasa();

  //@ts-ignore
  const provider = useMemo(() => {
    return typeof window !== 'undefined'
      ? //@ts-ignore
        window?.ethereum
        ? //@ts-ignore
          new ethers.providers.Web3Provider(window?.ethereum)
        : new ethers.providers.JsonRpcProvider(DEFAULT_RPC)
      : null;
  }, []);

  const accountChangedHandler = useCallback(
    async (newAccount) => {
      if (setProvider) setProvider(newAccount);
    },
    [setProvider]
  );

  const connect = useCallback(async () => {
    //@ts-ignore
    if (provider && window?.ethereum) {
      await provider.send('eth_requestAccounts', []);

      await accountChangedHandler(provider.getSigner(0));
      if (provider && setProvider) {
        setProvider(provider.getSigner(0));
        onConnect();
      }
    }
  }, [accountChangedHandler, setProvider, provider]);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
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

  const onConnect = () => {
    localStorage.setItem('isWalletConnected', 'true');
  };

  const handleLogout = useCallback(async () => {
    await masa?.session.logout();
  }, [masa]);

  const disconnect = useCallback(async () => {
    await handleLogout();
    localStorage.setItem('isWalletConnected', 'false');
    setProvider?.(null);
  }, [handleLogout, setProvider]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      //@ts-ignore
      window?.ethereum?.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          await handleLogout();
          await disconnect();
        }
      });
    }
  }, [handleLogout, disconnect]);

  return { connect };
};
