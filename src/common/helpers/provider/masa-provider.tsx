import { MasaContextProvider, MASA_CONTEXT } from './masa-context';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { MasaInterface } from '../../components/masa-interface';

export const useMasa = () => {
  return useContext(MASA_CONTEXT);
};

//@ts-ignore
const provider = new ethers.providers.Web3Provider(window?.ethereum);

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

export const MasaProvider = ({ children }: any) => {
  useMetamask();
  return (
    <MasaContextProvider>
      <MasaInterface />
      {children}
    </MasaContextProvider>
  );
};
