import { EnvironmentName, Masa } from '@masa-finance/masa-sdk';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createNewMasa } from '../masa';

export const MASA_CONTEXT = createContext<MasaShape>({});

export interface ArweaveConfig {
  port?: string;
  host?: string;
  protocol?: string;
  logging?: boolean;
}

export interface MasaContextProviderProps extends MasaShape {
  children: React.ReactNode;
  company?: string;
  environment?: EnvironmentName;
  signer?: any;
  noWallet?: boolean;
  arweaveConfig?: ArweaveConfig;
  cookie?: string
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
  handleCreateCreditScore?: () => void;
  creditScores?: any[] | null;
  loadCreditScores?: () => void;
  soulnames?: any[] | null;
  loadSoulnames?: () => void;
  logginLoading?: boolean;
  allowedForAllowlist?: boolean;
  allowlistInfo?: {
    isActive: boolean;
    success: boolean;
    wallet: string;
    endDate: string;
  } | null;
  missingProvider?: boolean;
  setMissingProvider?: (value: boolean) => void;
}

export const MasaContextProvider = ({
  children,
  company,
  environment = 'dev',
  signer: externalSigner,
  noWallet,
  arweaveConfig,
  cookie
}: MasaContextProviderProps) => {
  const [masaInstance, setMasaInstance] = useState<Masa | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [missingProvider, setMissingProvider] = useState<boolean>();

  const [isModalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [logginLoading, setLogginLoading] = useState(true);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [identity, setIdentity] = useState<any>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [modalCallback, setModalCallback] = useState<any>(null);

  const [creditScores, setCreditScores] = useState<any>(null);
  const [soulnames, setSoulnames] = useState<any[] | null>(null);

  const [allowedForAllowlist, setAllowedForAllowlist] = useState(false);
  const [allowlistInfo, setAllowlistInfo] = useState(null);

  const [scope, setScope] = useState<string[]>([]);

  const loadSoulnames = useCallback(async () => {
    try {
      setLoading?.(true);

      const soulnameList = await masaInstance?.soulName.list();
      setLoading?.(false);

      setSoulnames(soulnameList ?? null);
    } catch (e) {
      console.log(e);
      setLoading?.(false);
    }
  }, [masaInstance, setSoulnames, setLoading]);

  useEffect(() => {
    (async () => {
      if (masaInstance) {
        const isAllowed = await masaInstance?.session.checkAllowlist();
        console.log(
          '🚀 ~ file: masa-context.tsx:107 ~ ALLOWLIST INFO',
          isAllowed
        );
        if (isAllowed) {
          setAllowedForAllowlist(isAllowed.success);
          setAllowlistInfo(isAllowed);
        }
      }
    })();
  }, [masaInstance]);

  useEffect(() => {
    loadSoulnames();
  }, [loadSoulnames]);

  useEffect(() => {
    if (externalSigner) {
      setProvider(externalSigner);
    }
  }, [externalSigner]);

  const loadCreditScores = async () => {
    setLoading(true);
    const cr = await masaInstance?.creditScore.list();
    console.log('Getting credit scores', cr);
    if (cr?.length) {
      setCreditScores(cr);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (masaInstance) {
      void loadCreditScores();
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
      setLoading(true);
      const logged = await masaInstance.session.login();
      setLoggedIn(!!logged);
      setLoading(false);
    } else {
      setLoggedIn(false);
    }
  }, [masaInstance]);

  const handleLogout = useCallback(async () => {
    if (masaInstance) {
      setLoading(true);
      await masaInstance.session.logout();
      setLoggedIn(false);
      setLoading(false);
    } else {
      setLoggedIn(false);
    }
  }, [masaInstance, setLoggedIn]);

  const handleCreateCreditScore = useCallback(async () => {
    setLoading(true);

    const response = await masaInstance?.creditScore.create();
    setLoading(false);
    //@ts-ignore
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
    setLoading(true);

    console.log('Loading identity...');
    if (masaInstance && walletAddress) {
      //@ts-ignore
      const identityResult = await masaInstance.identity.load(walletAddress);
      console.log('Setting identity', identityResult);
      setIdentity(identityResult);
      setLogginLoading(false);
    } else {
      setIdentity(null);
    }
    setLoading(false);
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
    console.log({ noWallet });
    if (noWallet) {
      setMasaInstance(createNewMasa(undefined, environment, arweaveConfig, cookie));
    } else {
      if (provider) {
        setMasaInstance(createNewMasa(provider, environment, arweaveConfig, cookie));
      } else {
        setMasaInstance(null);
      }
    }
  }, [provider, noWallet]);

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
    handleCreateCreditScore,
    creditScores,
    loadCreditScores,
    soulnames,
    loadSoulnames,
    logginLoading,
    allowedForAllowlist,
    allowlistInfo,
    missingProvider,
    setMissingProvider,
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
