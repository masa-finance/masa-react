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

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          connect();
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

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
  }, [masa]);

  useEffect(() => {
    //@ts-ignore
    window?.ethereum?.on('accountsChanged', async function (accounts) {
      if (accounts.length === 0) {
        await handleLogout();
        disconnect();
      }
    });
  }, []);

  const connect = () => {
    //@ts-ignore
    if (window.ethereum) {
      provider.send('eth_requestAccounts', []).then(async () => {
        console.log('ETH ACCOUNT');
        await accountChangedHandler(provider.getSigner(0));
        if (provider && setProvider) {
          setProvider(provider.getSigner(0));
          onConnect();
        }
      });
    }
  };
  const accountChangedHandler = async (newAccount) => {
    if (setProvider) setProvider(newAccount);
  };

  return { connect };
};
