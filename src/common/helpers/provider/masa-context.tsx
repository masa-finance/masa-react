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

export interface MasaContextProviderProps extends MasaShape {
  children: React.ReactNode;
  company?: string;
  environment?: 'local' | 'dev' | 'beta' | 'test';
  signer?: any;
}

export interface MasaShape {
  children?: React.ReactNode;
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
  handlePurchaseIdentity?: () => void;
  connect?: (options?: { scope?: string[]; callback?: Function }) => void;
  closeModal?: Function;
  scope?: string[];
  company?: string;
  handleCreateCreditReport?: () => void;
  creditReports?: any[] | null;
  loadCreditReports?: () => void;
  soulnames?: any[] | null;
  loadSoulnames?: () => void;
  logginLoading?: boolean
}

export const MasaContextProvider = ({
  children,
  company,
  environment = 'dev',
  signer: externalSigner,
}: MasaContextProviderProps) => {
  const [masaInstance, setMasaInstance] = useState<Masa | null>(null);
  const [provider, setProvider] = useState<any>(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [logginLoading, setLogginLoading] = useState(true)

  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [identity, setIdentity] = useState<any>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [modalCallback, setModalCallback] = useState<any>(null);

  const [creditReports, setCreditReports] = useState<any>(null);
  const [soulnames, setSoulnames] = useState<any[] | null>(null);

  const [scope, setScope] = useState<string[]>([]);

  const loadSoulnames = useCallback(async () => {
    try {
      setLoading?.(true);

      const soulnameList = await masaInstance?.soulNames.list();
      setLoading?.(false);

      setSoulnames(soulnameList ?? null);
    } catch (e) {
      console.log(e);
      setLoading?.(false);
    }
  }, [masaInstance, setSoulnames, setLoading]);

  useEffect(() => {
    loadSoulnames();
  }, [loadSoulnames]);

  useEffect(() => {
    if (externalSigner) {
      setProvider(externalSigner);
    }
  }, [externalSigner]);

  const loadCreditReports = async () => {
    setLoading(true);
    const cr = await masaInstance?.creditScore.list();
    if (cr?.length) {
      setCreditReports(cr);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (masaInstance) {
      loadCreditReports();
    }
  }, [masaInstance]);
  const connect = useCallback(
    (options?: { scope?: string[]; callback?: Function }) => {
      setModalOpen(true);
      if (options?.scope) setScope(options.scope);
      if (typeof options?.callback === 'function') {
        setModalCallback(() => options?.callback);
      }
    },
    [setModalOpen, setModalCallback]
  );

  useEffect(() => {
    (async () => {
      if (masaInstance && walletAddress) {
        setLoading(true);
        const session = await masaInstance.session.getSession();

        if (session?.user.address !== walletAddress) {
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
      setLogginLoading(true);

      const logged = await masaInstance.session.checkLogin();
      setLoggedIn(logged);
      setLoading(false);
      setLogginLoading(false);
    } else {
      setLoggedIn(false);
    }
  }, [masaInstance]);

  const handleLogin = useCallback(async () => {
    if (masaInstance) {
      setLogginLoading(true);
      setLoading(true);
      const logged = await masaInstance.session.login();
      setLoggedIn(!!logged);
      setLoading(false);
      setLogginLoading(false);
    } else {
      setLoggedIn(false);
    }
  }, [masaInstance]);

  const handleLogout = useCallback(async () => {
    if (masaInstance) {
      setLoading(true);
      setLogginLoading(true);
      await masaInstance.session.logout();
      setLoggedIn(false);
      setLoading(false);
      setLogginLoading(false);
    } else {
      setLoggedIn(false);
    }
  }, [masaInstance, setLoggedIn]);

  const handleCreateCreditReport = useCallback(async () => {
    setLoading(true);

    const response = await masaInstance?.creditScore.create();
    setLoading(false);

    return response?.success;
  }, [masaInstance, setLoading]);
  useEffect(() => {
    void checkSession();
  }, [masaInstance, walletAddress, checkSession]);

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
    setLogginLoading(true);
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
    setLogginLoading(false);
  }, [masaInstance, walletAddress, setIdentity]);

  const handlePurchaseIdentity = useCallback(async () => {
    setLoading(true);
    await masaInstance?.identity.create();

    await loadIdentity();
    setLoading(false);
  }, [masaInstance, loadIdentity]);

  useEffect(() => {
    void loadIdentity();
  }, [loadIdentity]);

  useEffect(() => {
    if (provider) {
      setMasaInstance(createNewMasa(provider, environment));
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
    handlePurchaseIdentity,
    connect,
    closeModal,
    scope,
    company,
    handleCreateCreditReport,
    creditReports,
    loadCreditReports,
    soulnames,
    loadSoulnames,
    logginLoading
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
