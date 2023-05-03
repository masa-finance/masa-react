import { useCallback, useEffect, useState } from 'react';
import { useMasa } from './use-masa';
import { getWeb3Provider } from '../helpers';
import { Maybe } from '@metamask/providers/dist/utils';
import { useLocalStorage } from './use-local-storage';
import { MetaMaskInpageProvider } from '@metamask/providers';

export const useMetamask = ({
  disabled,
}: {
  disabled?: boolean;
}): { connectMetamask: () => void } => {
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const { setProvider, handleLogout, walletAddress, verbose, isLoggedIn } =
    useMasa();
  const { localStorageSet, localStorageGet } = useLocalStorage();

  const metamaskStorageKey = 'masa-react-metamask-connected';

  // use metamask can only be used inside the scope of masa-react
  // otherwise everything from useMasa is undefined
  if (Object.keys(useMasa()).length < 1) {
    throw new Error(
      'useMetamask() must be used inside the Masa provider scope!'
    );
  }

  /**
   * Connect to metamask
   */
  const connectMetamask = useCallback(async (): Promise<boolean> => {
    let metamaskConnected: boolean =
      localStorageGet<boolean>(metamaskStorageKey) || false;

    if (!disabled && window?.ethereum && !walletAddress) {
      let accounts: Maybe<string[]>;

      try {
        accounts = await window?.ethereum?.request({
          method: 'eth_requestAccounts',
        });

        if (verbose) {
          console.info({ accounts });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to connect to metamask!', error.message);
        }
      }

      if (accounts && Array.isArray(accounts)) {
        const signer = getWeb3Provider()?.getSigner();

        if (signer && accounts.length > 0 && setProvider) {
          setProvider(signer);
          metamaskConnected = true;
          localStorageSet<boolean>(metamaskStorageKey, true);
        } else {
          console.error('Unable to get signer from metamask');
        }
      } else {
        console.error('No accounts returned from metamask');
      }
    }

    if (verbose) {
      console.info({ metamaskConnected });
    }

    return metamaskConnected;
  }, [
    disabled,
    verbose,
    setProvider,
    localStorageGet,
    localStorageSet,
    walletAddress,
  ]);

  /**
   * Disconnect from metamask
   */
  const disconnectMetamask = useCallback(async (): Promise<void> => {
    localStorageSet<boolean>(metamaskStorageKey, false);

    if (isLoggedIn) {
      await handleLogout?.();
    }
  }, [isLoggedIn, handleLogout, localStorageSet]);

  /**
   * try to connect metamask on page load
   */
  useEffect(() => {
    const connectMetamaskOnPageLoad = async (): Promise<void> => {
      const metamaskConnected: boolean | undefined =
        localStorageGet<boolean>(metamaskStorageKey);

      if (!metamaskConnected) {
        return;
      }

      try {
        await connectMetamask();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Connect failed!', error.message);
        }
      }
    };

    void connectMetamaskOnPageLoad();
  }, [connectMetamask, localStorageGet]);

  /**
   * disconnect metamask on wallet change
   */
  useEffect(() => {
    const disconnectMetamaskOnWalletChange = async (): Promise<void> => {
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

    void disconnectMetamaskOnWalletChange();
  }, [connectedAccounts, disconnectMetamask, walletAddress, setProvider]);

  /**
   * wire up metamask event listeners
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      /**
       * on accounts change
       */
      (window.ethereum as unknown as MetaMaskInpageProvider)?.on(
        'accountsChanged',
        async (accounts: unknown): Promise<void> => {
          const accountsArray = accounts as string[];

          if (accountsArray.length === 0) {
            // no accounts, disconnect metamask
            await disconnectMetamask();
            // drop provider
            setProvider?.();
          }

          // update accounts
          setConnectedAccounts(accountsArray);
        }
      );

      /**
       * on network / chain changed
       */
      (window.ethereum as unknown as MetaMaskInpageProvider)?.on(
        'chainChanged',
        () => {
          setProvider?.(getWeb3Provider()?.getSigner());
        }
      );
    }
  }, [setProvider, setConnectedAccounts, disconnectMetamask]);

  return { connectMetamask };
};
