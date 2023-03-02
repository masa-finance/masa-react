import { useCallback, useEffect, useState } from 'react';
import { useMasa } from './use-masa';
import { getWeb3Provider } from '../helpers';
// localStorage.removeItem("account");
// acc = localStorage.setItem("account", accounts1);

export const useMetamask = ({
  disabled,
}: {
  disabled?: boolean;
}): { connect: () => void } => {
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
  const connect = useCallback(async () => {
    console.log({ disabled });

    if (!disabled && window?.ethereum) {
      await window?.ethereum?.request({ method: 'eth_requestAccounts' });
      setProvider?.(getWeb3Provider()?.getSigner());

      localStorage.setItem('metamask-connected', 'true');
    }
  }, [disabled, setProvider]);

  /**
   * Disconnect
   */
  const disconnect = useCallback(async (): Promise<void> => {
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
        await disconnect();
      }
    };

    void detectWalletChange();
  }, [connectedAccounts, disconnect, walletAddress, setProvider]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window?.ethereum?.on(
        'accountsChanged',
        async (accounts: unknown): Promise<void> => {
          const accountsArray = accounts as string[];

          if (accountsArray.length === 0) {
            await disconnect();
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
  }, [setProvider, setConnectedAccounts, disconnect]);

  return { connect };
};
