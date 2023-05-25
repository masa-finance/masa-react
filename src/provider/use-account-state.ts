/**
 * quick collector object for account state;
 */

import { Masa, SoulNameDetails } from '@masa-finance/masa-sdk';
import { BigNumber, Signer } from 'ethers';
import { ConnectorData, useAccount, useProvider } from 'wagmi';
import { useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import {
  invalidateAllQueries,
  invalidateIdentity,
  invalidateWallet,
  invalidateCreditScores,
  invalidateGreen,
  // invalidateSession,
  useLogout,
  invalidateCustomSBTs,
  invalidateCustomSBTContracts,
} from './hooks';

export const useAccountState = ({
  masa,
  walletAddress,
  signer,
  identity,
  hasWalletAddress,
  reloadWallet,
  soulnames,
}: {
  masa?: Masa;
  walletAddress?: string;
  signer?: Signer;
  isLoggedIn?: boolean;
  identity?:
    | {
        identityId?: BigNumber | undefined;
        address?: string;
      }
    | undefined;
  soulnames?: SoulNameDetails[] | undefined;
  hasWalletAddress?: boolean;
  reloadIdentity?: () => Promise<unknown>;
  reloadWallet?: () => Promise<unknown>;
  invalidateCustomSBTs?: () => void;
}) => {
  const [accountAddress, setAccountAddress] = useState<string | undefined>(
    walletAddress
  );

  const {
    isConnected,
    isConnecting,
    isDisconnected,
    connector: activeConnector,
    address: wagmiAddress,
  } = useAccount();

  const walletName = useMemo(() => activeConnector?.name, [activeConnector]);

  const provider = useProvider();

  const { isLoggingOut, hasLoggedOut } = useLogout({
    masa,
    signer,
    walletAddress,
  });

  // * detects if we have a new account or chain
  useAsync(async () => {
    const handleConnectorUpdate = async ({ account, chain }: ConnectorData) => {
      if (account) {
        setAccountAddress(account);
        await invalidateAllQueries({ masa, signer, walletAddress });
      } else if (chain) {
        await Promise.all([
          invalidateIdentity({ masa, signer, walletAddress }),
          invalidateCreditScores({ masa, signer, walletAddress }),
          invalidateGreen({ masa, signer, walletAddress }),
          invalidateCustomSBTs(),
          invalidateCustomSBTContracts(),
        ]);
      }
    };

    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate);
    }

    // * walletconnect

    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts: string[]) => {
      console.log('for wc acc changed', accounts);
    });

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId: number) => {
      console.log('for wc chainid changed', chainId);
    });

    // Subscribe to session disconnection
    provider.on('disconnect', (code: number, reason: string) => {
      console.log('for wc disc', code, reason);
    });

    return () => {
      activeConnector?.off('change', () => async () => handleConnectorUpdate);
      provider.off('accountsChanged', () => {});
      provider.off('chainChanged', () => {});
      provider.off('disconnect', () => {});
    };
  }, [activeConnector, reloadWallet, masa, signer, walletAddress]);

  const hasAccountAddress = useMemo(() => !!accountAddress, [accountAddress]);

  useAsync(async () => {
    // * initial state, just make sure walletAddress is passed to account address
    // * if we are initializing
    // * TODO: remove this logic once proper walletAddress scoping is in place
    if (walletAddress && !accountAddress && !isDisconnected) {
      setAccountAddress(walletAddress);
      await invalidateAllQueries({ masa, signer, walletAddress });
    } else if (accountAddress && !walletAddress && isDisconnected) {
      setAccountAddress(undefined);
      await invalidateAllQueries({ masa, signer, walletAddress });
    }
  }, [
    walletAddress,
    accountAddress,
    wagmiAddress,
    isDisconnected,
    reloadWallet,
    masa,
    signer,
  ]);

  // * weird edge case
  useAsync(async () => {
    if (isDisconnected) {
      await invalidateAllQueries({ masa, signer, walletAddress });
      return;
    }

    if (isConnected) {
      if (hasAccountAddress && hasWalletAddress) return;
      if (wagmiAddress) setAccountAddress(wagmiAddress);

      await invalidateIdentity({ masa, signer, walletAddress });
      await invalidateWallet({ masa, signer, walletAddress });
    }
  }, [
    masa,
    signer,
    walletAddress,
    accountAddress,
    isConnected,
    hasWalletAddress,
    hasAccountAddress,
    wagmiAddress,
    reloadWallet,
  ]);

  // * we are in our bug case
  useAsync(async () => {
    if (wagmiAddress === accountAddress && !hasWalletAddress && !signer) {
      await invalidateAllQueries({
        masa,
        signer,
        walletAddress,
      });
    }
  }, [hasWalletAddress, accountAddress, wagmiAddress, reloadWallet]);

  if (masa?.config.verbose) {
    console.log('use-account-state', {
      accountAddress,
      signer,
      isConnected,
      isConnecting,
      isDisconnected,

      hasLoggedOut,
      isLoggingOut,

      hasWalletAddress,
      hasAccountAddress,
      walletAddress,
    });
  }

  return {
    accountAddress,
    signer,
    isConnected,
    isConnecting,
    isDisconnected,
    identity,
    soulnames,

    hasLoggedOut,
    isLoggingOut,

    hasWalletAddress,
    hasAccountAddress,
    walletAddress,
    walletName,
  };
};
