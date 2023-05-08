import { useCallback, useEffect, useState } from 'react';
import { useMasa } from './use-masa';
import { Maybe } from '@metamask/providers/dist/utils';
import { useLocalStorage } from './use-local-storage';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { providers } from 'ethers';

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
}): { connectMetamask: () => void } => {
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const { setSigner, handleLogout, walletAddress, verbose, isLoggedIn } =
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

        if (signer && accounts.length > 0 && setSigner) {
          setSigner(signer);
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
    setSigner,
    localStorageGet,
    localStorageSet,
    walletAddress,
  ]);

  /**
   * Disconnect from metamask
   */
  const disconnectMetamask = useCallback(async (): Promise<void> => {
    let metamaskConnected: boolean =
      localStorageGet<boolean>(metamaskStorageKey) || false;

      // Check that metamask was connected ( This may need a refactor, this disconnect was disconnecting valora when signin in )
    if (metamaskConnected) return;

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
  }, [connectedAccounts, disconnectMetamask, walletAddress, setSigner]);

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
            setSigner?.();
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
          setSigner?.(getWeb3Provider()?.getSigner());
        }
      );
    }
  }, [setSigner, setConnectedAccounts, disconnectMetamask]);

  return { connectMetamask };
};
