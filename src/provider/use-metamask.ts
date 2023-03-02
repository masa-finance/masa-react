import { useCallback, useEffect, useState } from 'react';
import { useMasa } from './use-masa';
import { getWeb3Provider } from '../helpers';
import { Maybe } from '@metamask/providers/dist/utils';

export const useMetamask = ({
  disabled,
}: {
  disabled?: boolean;
}): { connectMetamask: () => void } => {
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const { setProvider, handleLogout, isConnected, walletAddress } = useMasa();

  // use metamask can only be used inside the scope of masa-react
  // otherwise everything from useMasa is undefined
  if (Object.keys(useMasa()).length < 1) {
    throw new Error('useMetamask must be used inside the masa provider scope');
  }

  /**
   * Connect to metamask
   */
  const connect = useCallback(async (): Promise<boolean> => {
    let connected = false;

    if (!disabled && window?.ethereum) {
      let hasAccounts = false;

      try {
        const accounts: Maybe<string[]> = await window?.ethereum?.request({
          method: 'eth_requestAccounts',
        });

        if (accounts && Array.isArray(accounts)) {
          hasAccounts = accounts.length > 0;
        } else {
          console.error('No accounts returned from metamask');
        }
      } catch (error) {
        if (error instanceof Error)
          console.error('Failed to connect to metamask!', error.message);
      }

      const signer = getWeb3Provider()?.getSigner();
      if (hasAccounts && signer) {
        setProvider?.(signer);
        connected = true;
        localStorage.setItem('metamask-connected', 'true');
      } else {
        console.error('Unable to get signer from metamask');
      }
    }

    return connected;
  }, [disabled, setProvider]);

  /**
   * Disconnect
   */
  const disconnectMetamask = useCallback(async (): Promise<void> => {
    if (isConnected) {
      localStorage.setItem('metamask-connected', 'false');
      await handleLogout?.();
    }
  }, [isConnected, handleLogout]);

  useEffect(() => {
    const connectWalletOnPageLoad = async (): Promise<void> => {
      const metamaskConnected = localStorage.getItem('metamask-connected');

      if (walletAddress || !metamaskConnected || metamaskConnected === 'false')
        return;

      try {
        await connect();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Connect failed!', error.message);
        }
      }
    };
    void connectWalletOnPageLoad();
  }, [walletAddress, connect]);

  useEffect(() => {
    const detectWalletChange = async (): Promise<void> => {
      if (
        walletAddress &&
        connectedAccounts.length > 0 &&
        !connectedAccounts
          .map((account: string) => account.toLowerCase())
          .includes(walletAddress.toLowerCase())
      ) {
        await disconnectMetamask();
      }
    };

    void detectWalletChange();
  }, [connectedAccounts, disconnectMetamask, walletAddress, setProvider]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window?.ethereum?.on(
        'accountsChanged',
        async (accounts: unknown): Promise<void> => {
          const accountsArray = accounts as string[];

          if (accountsArray.length === 0) {
            await disconnectMetamask();
            setProvider?.();
          }

          setConnectedAccounts(accountsArray);
        }
      );

      window?.ethereum?.on('chainChanged', async () => {
        const newProvider = getWeb3Provider();
        setProvider?.(newProvider?.getSigner());
      });
    }
  }, [setProvider, setConnectedAccounts, disconnectMetamask]);

  return { connectMetamask: connect };
};
