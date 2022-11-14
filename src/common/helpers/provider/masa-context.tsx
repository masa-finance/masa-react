import { Masa } from '@masa-finance/masa-sdk';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createNewMasa } from '../masa';

export const MASA_CONTEXT = createContext<MasaShape>({});

interface MasaContextProviderProps extends MasaShape {
  children: React.ReactNode;
}

export interface MasaShape {
  setProvider?: (provider: any) => void;
  provider?: any;
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
  handlePurchaseSoulname?: (
    soulname: string,
    duration: number,
    paymentMethod: string
  ) => void;
  connect?: (callback?: Function) => void;
  closeModal?: Function;
}

export const MasaContextProvider = ({ children }: MasaContextProviderProps) => {
  const [masaInstance, setMasaInstance] = useState<Masa | null>(null);
  const [provider, setProvider] = useState<any>(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [identity, setIdentity] = useState<any>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [modalCallback, setModalCallback] = useState<any>(null);

  const connect = useCallback(
    (callback?: Function) => {
      setModalOpen(true);
      if (typeof callback === 'function') {
        setModalCallback(() => callback);
      }
    },
    [setModalOpen, setModalCallback]
  );

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
    void checkSession();
  }, [masaInstance, walletAddress]);

  const isConnected = useMemo(() => {
    return !!walletAddress;
  }, [walletAddress]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (modalCallback && loggedIn && isConnected) {
      modalCallback();
    }
  }, [modalCallback, setModalOpen, loggedIn, isConnected]);

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

  const loadIdentity = useCallback(async () => {
    setLoading(true);

    console.log('Loading identity...');
    if (masaInstance && walletAddress) {
      //@ts-ignore
      const identityResult = await masaInstance.identity.load(walletAddress);
      console.log('Setting identity', identityResult);
      setIdentity(identityResult);
    } else {
      setIdentity(null);
    }
    setLoading(false);
  }, [masaInstance, walletAddress, setIdentity]);

  const handlePurchaseSoulname = useCallback(
    async (soulname, duration, paymentMethod) => {
      await masaInstance?.identity.createWithSoulName(
        soulname,
        duration,
        paymentMethod
      );

      await loadIdentity();
    },
    [masaInstance, loadIdentity]
  );

  useEffect(() => {
    void loadIdentity();
  }, [loadIdentity]);

  useEffect(() => {
    if (provider) {
      setMasaInstance(createNewMasa(provider));
    } else {
      setMasaInstance(null);
    }
  }, [provider]);

  const context = {
    setProvider,
    provider,
    isModalOpen,
    setModalOpen,
    masa: masaInstance as Masa,
    isConnected,
    loading,
    setLoading,
    walletAddress,
    identity,
    loggedIn,
    handleLogin,
    handleLogout,
    handlePurchaseSoulname,
    connect,
    closeModal,
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
