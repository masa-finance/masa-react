import { Masa } from '@masa-finance/masa-sdk';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDebounce, useDebounceIfValue } from '../hooks/useDebounce';
import { createNewMasa } from '../masa';

export const MASA_CONTEXT = createContext<MasaShape>({});

interface MasaContextProviderProps extends MasaShape {
  children: React.ReactNode;
}

export interface MasaShape {
  setProvider?: (provider: any) => void;
  isModalOpen?: boolean;
  setModalOpen?: (val: boolean) => void;
  masa?: Masa;
  isConnected?: boolean;
  loading?: boolean;
  setLoading?: (val: boolean) => void;
  walletAddress?: string | null;
  identity?: any;
  loggedIn?: boolean;
  handleLogin?: () => void;
  handleLogout?: () => void;
}

export const MasaContextProvider = ({ children }: MasaContextProviderProps) => {
  const [masaInstance, setMasaInstance] = useState<Masa | null>(null);
  const [provider, setProvider] = useState<any>(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [identity, setIdentity] = useState<any>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (masaInstance && walletAddress) {
        setLoading(true);
        const sessionResponse = await masaInstance.session.getSession();

        if (sessionResponse.session.user.address !== walletAddress) {
          await masaInstance.session.logout();
          setLoggedIn(false);
        }
        setLoading(false);
      } else {
        setLoggedIn(false);
      }
    })();
  }, [masaInstance, walletAddress]);

  const checkSession = useCallback(async () => {
    if (masaInstance) {
      setLoading(true);
      const logged = await masaInstance.session.checkLogin();
      setLoggedIn(logged);
      setLoading(false);
    } else {
      setLoggedIn(false);
    }
  }, [masaInstance, walletAddress]);

  const handleLogin = useCallback(async () => {
    if (masaInstance) {
      setLoading(true);
      const logged = await masaInstance.session.login();
      setLoggedIn(!!logged);
      setLoading(false);
    } else {
      setLoggedIn(false);
    }
  }, [masaInstance, walletAddress]);

  const handleLogout = useCallback(async () => {
    if (masaInstance) {
      setLoading(true);
      await masaInstance.session.logout();
      setLoggedIn(false);
      setLoading(false);
    } else {
      setLoggedIn(false);
    }
  }, [masaInstance, walletAddress, setLoggedIn]);

  useEffect(() => {
    checkSession();
  }, [masaInstance, walletAddress]);

  const isConnected = useMemo(() => {
    return !!walletAddress;
  }, [walletAddress]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (masaInstance) {
        const address = await masaInstance.config.wallet.getAddress();
        setWalletAddress(typeof address === 'string' ? address : null);
      } else {
        setWalletAddress(null);
      }
      setLoading(false);
    })();
  }, [masaInstance]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (masaInstance && walletAddress) {
        //@ts-ignore
        const identityResult = await masaInstance.identity.load(walletAddress);
        setIdentity(identityResult);
      } else {
        setIdentity(null);
      }
      setLoading(false);
    })();
  }, [masaInstance, walletAddress, setIdentity]);

  useEffect(() => {
    if (provider) {
      setMasaInstance(createNewMasa(provider));
    } else {
      setMasaInstance(null);
    }
  }, [provider]);
  const context = {
    provider,
    setProvider,
    masa: masaInstance as Masa,
    isModalOpen,
    setModalOpen,
    isConnected,
    loading,
    setLoading,
    walletAddress,
    identity,
    loggedIn,
    handleLogin,
    handleLogout,
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
