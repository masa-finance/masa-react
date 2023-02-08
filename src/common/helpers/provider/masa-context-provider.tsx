import { EnvironmentName, Masa } from '@masa-finance/masa-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createNewMasa } from '../masa';
import {
  useCreditScores,
  useGreen,
  useIdentity,
  useSession,
  useSoulnames,
  useWallet,
} from './modules';
import { ethers } from 'ethers';
import { MASA_CONTEXT, MasaShape } from './masa-context';
import { SupportedNetworks } from '../utils/networks';

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
  signer?: ethers.Wallet | ethers.Signer;
  noWallet?: boolean;
  arweaveConfig?: ArweaveConfig;
  verbose?: boolean;
}

export const MasaContextProvider = ({
  children,
  company,
  environment = 'dev' as EnvironmentNameEx,
  verbose = false,
  signer: externalSigner,
  noWallet,
  arweaveConfig,
}: MasaContextProviderProps): JSX.Element => {
  const [masaInstance, setMasaInstance] = useState<Masa | null>(null);

  const [provider, setProvider] = useState<
    ethers.Wallet | ethers.Signer | null
  >(null);
  const [missingProvider, setMissingProvider] = useState<boolean>();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);

  const [scope, setScope] = useState<string[]>([]);

  // Modules
  const {
    walletAddress,
    isLoading: walletLoading,
    chain,
  }: {
    walletAddress: string | undefined;
    isLoading: boolean;
    chain?: null | ethers.providers.Network;
  } = useWallet(masaInstance, provider);

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
    greens,
    isLoading: greenLoading,
    handleGenerateGreen,
    handleCreateGreen,
  } = useGreen(masaInstance, walletAddress, identity);

  const {
    loggedIn,
    login: handleLogin,
    logout: handleLogout,
    isLoading: sessionLoading,
  } = useSession(masaInstance, walletAddress);

  // Logic

  console.log({ chain });

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
    (options?: { scope?: string[]; callback?: () => void }) => {
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
        createNewMasa({
          environment,
          arweaveConfig,
          verbose,
        })
      );
    } else if (provider) {
      setMasaInstance(
        createNewMasa({
          newWallet: provider,
          environment,
          arweaveConfig,
          verbose,
        })
      );
    } else {
      setMasaInstance(null);
    }
  }, [
    provider,
    noWallet,
    walletAddress,
    arweaveConfig,
    environment,
    verbose,
    chain,
  ]);

  const addNetwork = useCallback(
    async (networkDetails) => {
      try {
        if (typeof window !== 'undefined' && networkDetails) {
          await window?.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [networkDetails],
          });
        }
      } catch (err) {
        console.log(
          `error ocuured while adding new chain with chainId:${networkDetails?.chainId}`
        );
      }
    },
    [provider]
  );

  const switchNetwork = useCallback(
    async (chainId: number) => {
      try {
        if (typeof window !== 'undefined') {
          await window?.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(chainId) }],
          });
          console.log(`switched to chainid : ${chainId} succesfully`);
        }
      } catch (err) {
        const error = err as { code: number };
        if (error.code === 4902) {
          addNetwork(SupportedNetworks[chainId]);
        }
      }
    },
    [provider]
  );

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
    handleLogin,
    handleLogout,
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
    greens,
    handleGenerateGreen,
    handleCreateGreen,
    chain,
    switchNetwork,
    SupportedNetworks,
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
