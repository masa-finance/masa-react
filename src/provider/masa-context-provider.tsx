import { EnvironmentName, Masa } from '@masa-finance/masa-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createNewMasa, Network, SupportedNetworks } from '../helpers';
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
import { queryClient } from './masa-query-client';

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
  environmentName?: EnvironmentNameEx;
  signer?: ethers.Wallet | ethers.Signer;
  noWallet?: boolean;
  arweaveConfig?: ArweaveConfig;
  verbose?: boolean;
  network?: string;
}

export const MasaContextProvider = ({
  children,
  company,
  environmentName = 'dev' as EnvironmentNameEx,
  verbose = false,
  signer: externalSigner,
  noWallet,
  arweaveConfig,
  network,
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
  } = useGreen(masaInstance, walletAddress);

  const {
    loggedIn,
    login: handleLogin,
    logout: handleLogout,
    isLoading: sessionLoading,
  } = useSession(masaInstance, walletAddress);

  // Logic

  const loading = useMemo(() => {
    return (
      !masaInstance ||
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
    masaInstance,
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
    if (
      modalCallback &&
      loggedIn &&
      isConnected &&
      (network ? !chain?.name.includes(network) : true)
    ) {
      modalCallback();
    }
  }, [modalCallback, setModalOpen, loggedIn, isConnected, network, chain]);

  useEffect(() => {
    const loadMasa = async (): Promise<void> => {
      if (!provider) return;
      const masa: Masa | null = await createNewMasa({
        newWallet: provider,
        environmentName,
        arweaveConfig,
        verbose,
      });

      void setMasaInstance(masa);
    };

    void loadMasa();

    queryClient.invalidateQueries('green');
  }, [
    provider,
    noWallet,
    walletAddress,
    arweaveConfig,
    environmentName,
    verbose,
    chain,
  ]);

  const addNetwork = useCallback(async (networkDetails: Network) => {
    try {
      if (typeof window !== 'undefined' && networkDetails) {
        await window?.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networkDetails,
              chainId: ethers.utils.hexValue(networkDetails.chainId),
            },
          ],
        });
      }
    } catch (error) {
      console.error(
        `error ocuured while adding new chain with chainId:${networkDetails?.chainId}`
      );
    }
  }, []);

  const switchNetwork = useCallback(
    async (chainId: number) => {
      try {
        if (typeof window !== 'undefined') {
          await window?.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(chainId) }],
          });
          console.log(`switched to chainId: ${chainId} successfully`);
        }
      } catch (err) {
        const error = err as { code: number };
        if (error.code === 4902) {
          void addNetwork(SupportedNetworks[chainId]);
        }
      }
    },
    [addNetwork]
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
    greenLoading,
    handleGenerateGreen,
    handleCreateGreen,
    chain,
    switchNetwork,
    SupportedNetworks,
    network,
  };

  return (
    <MASA_CONTEXT.Provider value={context}>{children}</MASA_CONTEXT.Provider>
  );
};
