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
  const { setProvider, handleLogout, isConnected, walletAddress, masa } =
    useMasa();

  // use metamask can only be used inside the scope of masa-react
  // otherwise everything from useMasa is undefined
  if (Object.keys(useMasa()).length < 1) {
    throw new Error('useMetamask must be used inside the masa provider scope');
  }

  /**
   * Connect to metamask
   */
  const connectMetamask = useCallback(async (): Promise<boolean> => {
    let metamaskConnected = false;

    if (!disabled && window?.ethereum && !isConnected) {
      let hasAccounts = false;
      let accounts: Maybe<string[]>;

      try {
        accounts = await window?.ethereum?.request({
          method: 'eth_requestAccounts',
        });

        if (masa?.config.verbose) {
          console.log({ accounts });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to connect to metamask!', error.message);
        }
      }

      if (accounts && Array.isArray(accounts)) {
        hasAccounts = accounts.length > 0;
      } else {
        console.error('No accounts returned from metamask');
      }

      const signer = getWeb3Provider()?.getSigner();

      if (hasAccounts && signer) {
        setProvider?.(signer);
        metamaskConnected = true;

        localStorage.setItem(
          `metamask-connected-${await signer.getAddress()}`,
          'true'
        );
      } else {
        console.error('Unable to get signer from metamask');
      }
    }

    if (masa?.config.verbose) {
      console.log({ metamaskConnected });
    }

    return metamaskConnected;
  }, [disabled, setProvider, masa, isConnected]);

  /**
   * Disconnect
   */
  const disconnectMetamask = useCallback(async (): Promise<void> => {
    if (isConnected) {
      localStorage.setItem(`metamask-connected-${walletAddress}`, 'false');
      await handleLogout?.();
    }
  }, [isConnected, handleLogout, walletAddress]);

  /**
   * try to connect metamask but not if already connected
   */
  useEffect(() => {
    const connectWalletOnPageLoad = async (): Promise<void> => {
      const metamaskConnected = localStorage.getItem(
        `metamask-connected-${walletAddress}`
      );

      if (
        masa?.config.network === 'unknown' ||
        !metamaskConnected ||
        metamaskConnected === 'false'
      ) {
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

    void connectWalletOnPageLoad();
  }, [walletAddress, connectMetamask, masa]);

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
      window?.ethereum?.on(
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
      window?.ethereum?.on('chainChanged', async () => {
        setProvider?.(getWeb3Provider()?.getSigner());
      });
    }
  }, [setProvider, setConnectedAccounts, disconnectMetamask]);

  return { connectMetamask };
};
