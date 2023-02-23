import { providers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMasa } from './use-masa';

export const getWeb3Provider = (): providers.Web3Provider | undefined => {
  if (
    typeof window !== 'undefined' &&
    typeof window?.ethereum !== 'undefined'
  ) {
    return new providers.Web3Provider(
      window?.ethereum as unknown as providers.ExternalProvider
    );
  }

  return;
};

export const useMetamask = ({
  disabled,
}: {
  disabled?: boolean;
}): { connect: () => void } => {
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const {
    setProvider,
    setIsProviderMissing,
    handleLogout,
    isConnected,
    walletAddress,
  } = useMasa();

  // use metamask can only be used inside the scope of masa-react
  // otherwise everything from useMasa is undefined
  if (Object.keys(useMasa()).length < 1) {
    throw new Error('useMetamask must be used inside the masa provider scope');
  }

  const provider = useMemo((): providers.Web3Provider | undefined => {
    return getWeb3Provider();
  }, []);

  useEffect(() => {
    setIsProviderMissing?.(!provider);
  }, [provider, setIsProviderMissing]);

  const loadSignerFromProvider = useCallback(
    async (provider: providers.Web3Provider) => {
      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();
      if (signer) {
        setProvider?.(signer);
      }
    },
    [setProvider]
  );

  const connect = useCallback(async () => {
    console.log({ disabled });

    if (!disabled && provider && window?.ethereum) {
      await loadSignerFromProvider(provider);
    }
  }, [provider, disabled, loadSignerFromProvider]);

  useEffect(() => {
    const connectWalletOnPageLoad = async (): Promise<void> => {
      if (isConnected) return;

      try {
        await connect();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Connect failed!', error.message);
        }
      }
    };
    void connectWalletOnPageLoad();
  }, [isConnected, connect]);

  const disconnect = useCallback(async (): Promise<void> => {
    if (isConnected) {
      await handleLogout?.();
    }
  }, [isConnected, handleLogout]);

  useEffect(() => {
    const detectWalletChange = async (): Promise<void> => {
      if (
        walletAddress &&
        connectedAccounts.length > 0 &&
        !connectedAccounts.includes(walletAddress)
      ) {
        await disconnect();
      }
    };

    void detectWalletChange();
  }, [connectedAccounts, disconnect, walletAddress]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window?.ethereum?.on(
        'accountsChanged',
        async (accounts: unknown): Promise<void> => {
          const accountsArray = accounts as string[];
          setConnectedAccounts(accountsArray);
        }
      );

      window?.ethereum?.on('networkChanged', async () => {
        const newProvider = getWeb3Provider();
        if (newProvider) {
          await loadSignerFromProvider(newProvider);
        }
      });
    }
  }, [loadSignerFromProvider, setConnectedAccounts]);

  return { connect };
};
