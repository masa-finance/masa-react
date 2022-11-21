import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useMasa } from './use-masa';

//@ts-ignore
const provider = window?.ethereum
  ? //@ts-ignore
    new ethers.providers.Web3Provider(window?.ethereum)
  : new ethers.providers.JsonRpcProvider();

export const useMetamask = () => {
  const { setProvider, masa } = useMasa();

  const accountChangedHandler = useCallback(
    async (newAccount) => {
      if (setProvider) setProvider(newAccount);
    },
    [setProvider]
  );

  const connect = useCallback(async () => {
    //@ts-ignore
    if (window.ethereum) {
      await provider.send('eth_requestAccounts', []);

      await accountChangedHandler(provider.getSigner(0));
      if (provider && setProvider) {
        setProvider(provider.getSigner(0));
        onConnect();
      }
    }
  }, [accountChangedHandler, setProvider]);

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
    //@ts-ignore
    window?.ethereum?.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        await handleLogout();
        await disconnect();
      }
    });
  }, [handleLogout, disconnect]);

  return { connect };
};
