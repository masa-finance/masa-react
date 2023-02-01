import { EnvironmentName, Masa } from '@masa-finance/masa-sdk';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createNewMasa } from '../masa';
import { useCreditScores } from './modules/creditScores/creditScores';
import { useGreen } from './modules/green/green';
import { useIdentity } from './modules/identity/identity';
import { useSession } from './modules/session/session';
import { useSoulnames } from './modules/soulnames/soulnames';
import { useWallet } from './modules/wallet/wallet';

export const MASA_CONTEXT = createContext<MasaShape>({});

export interface ArweaveConfig {
  port?: string;
  host?: string;
  protocol?: string;
  logging?: boolean;
}

export type EnvironmentNameEx = EnvironmentName & ('local' | 'stage');

export interface MasaContextProviderProps extends MasaShape {
  children: React.ReactNode;
  company?: string;
  environment?: EnvironmentNameEx;
  signer?: any;
  noWallet?: boolean;
  arweaveConfig?: ArweaveConfig;
  cookie?: string;
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
  walletAddress?: string | null;
  identity?: any;
  loggedIn?: boolean;
  handleLogin?: () => void;
  handleLogout?: (callback?: () => void) => void;
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
  missingProvider?: boolean;
  setMissingProvider?: (value: boolean) => void;
  green?: any;
  handleCreateGreen?: (phoneNumber: string, code: string) => any;
  handleGenerateGreen?: (phoneNumber: string) => any;
}

export const MasaContextProvider = ({
  children,
  company,
  environment = 'dev' as EnvironmentNameEx,
  signer: externalSigner,
  noWallet,
  arweaveConfig,
  cookie,
}: MasaContextProviderProps) => {
  const [masaInstance, setMasaInstance] = useState<Masa | null>(null);

  const [provider, setProvider] = useState<any>(null);
  const [missingProvider, setMissingProvider] = useState<boolean>();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalCallback, setModalCallback] = useState<any>(null);

  const [scope, setScope] = useState<string[]>([]);

  // Modules
  const { wallet: walletAddress, isLoading: walletLoading } = useWallet(
    masaInstance,
    provider
  );
  const {
    identity,
    handlePurchaseIdentity,
    isLoading: identityLoading,
  } = useIdentity(masaInstance, walletAddress);
  const { soulnames } = useSoulnames(masaInstance, walletAddress, identity);
  const {
    creditScores,
    isLoading: creditScoreLoading,
    handleCreateCreditScore,
  } = useCreditScores(masaInstance, walletAddress, identity);
  const {
    green,
    isLoading: greenLoading,
    handleGenerateGreen,
    handleCreateGreen,
  } = useGreen(masaInstance, walletAddress, identity);

  const {
    session: loggedIn,
    login,
    logout,
    isLoading: sessionLoading,
  } = useSession(masaInstance, walletAddress);

  // Logic

  const loading = useMemo(() => {
    return (
      sessionLoading ||
      creditScoreLoading ||
      identityLoading ||
      walletLoading ||
      greenLoading
    );
  }, [
    sessionLoading,
    creditScoreLoading,
    identityLoading,
    walletLoading,
    greenLoading,
  ]);

  useEffect(() => {
    if (externalSigner) {
      setProvider(externalSigner);
    }
  }, [externalSigner]);

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
    if (noWallet) {
      setMasaInstance(
        createNewMasa(undefined, environment, arweaveConfig, cookie)
      );
    } else {
      if (provider) {
        setMasaInstance(
          createNewMasa(provider, environment, arweaveConfig, cookie)
        );
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
    walletAddress,
    identity,
    loggedIn,
    handleLogin: login,
    handleLogout: logout,
    handlePurchaseIdentity,
    connect,
    closeModal,
    scope,
    company,
    handleCreateCreditScore,
    creditScores,
    soulnames,
    logginLoading: sessionLoading,
    missingProvider,
    setMissingProvider,
    green,
    handleGenerateGreen,
    handleCreateGreen,
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
