/**
 * quick collector object for account state;
 */

import { Masa, SoulNameDetails } from '@masa-finance/masa-sdk';
import { BigNumber, Signer } from 'ethers';
import { ConnectorData, useAccount } from 'wagmi';
import { invalidateAllQueries, useLogout } from './hooks';
import { useMemo, useState } from 'react';
import { useAsync } from 'react-use';

export const useAccountState = ({
  masa,
  walletAddress,
  signer,
  identity,
  isLoggedIn,
  hasWalletAddress,
  reloadIdentity,
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
  reloadIdentity?: () => void;
  reloadWallet?: () => void;
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
  const { isLoggingOut, hasLoggedOut } = useLogout({
    masa,
    signer,
    walletAddress,
  });

  // * detects if we have a new account or chain
  useAsync(async () => {
    const handleConnectorUpdate = async ({ account, chain }: ConnectorData) => {
      if (account) {
        console.log('new account', account);
        setAccountAddress(account);
        await invalidateAllQueries({ masa, signer, walletAddress });
        // reloadIdentity?.();
        // reloadWallet?.();
      } else if (chain) {
        console.log('new chain', chain);
      }
    };

    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate);
    }

    return () => {
      activeConnector?.off('change', handleConnectorUpdate);
    };
  }, [
    activeConnector,
    reloadIdentity,
    reloadWallet,
    masa,
    signer,
    walletAddress,
  ]);

  const hasAccountAddress = useMemo(() => {
    return !!accountAddress;
  }, [accountAddress]);

  useAsync(async () => {
    // * initial state, just make sure walletAddress is passed to account address
    // * if we are initializing
    // * TODO: remove this logic once proper walletAddress scoping is in place
    if (walletAddress && !accountAddress && !isDisconnected) {
      console.log('setting account address to wallet address', walletAddress);
      setAccountAddress(walletAddress);
      await invalidateAllQueries({ masa, signer, walletAddress });
    }
  }, [
    walletAddress,
    accountAddress,
    wagmiAddress,
    isDisconnected,
    reloadIdentity,
    reloadWallet,
    masa,
    signer,
  ]);

  console.log('renderaccountstate', {
    wagmiAddress,
    hasAccountAddress,
    hasWalletAddress,
    identity,
    soulnames,
  });
  // * weird edge case
  useAsync(async () => {
    if (isConnected) {
      if (hasAccountAddress && hasWalletAddress) return;
      if (wagmiAddress) setAccountAddress(wagmiAddress);
      await invalidateAllQueries({ masa, signer, walletAddress });
      console.log();
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
    reloadIdentity,
  ]);

  // * we are in our bug case
  useAsync(async () => {
    if (wagmiAddress === accountAddress && !hasWalletAddress && !signer) {
      await invalidateAllQueries({
        masa,
        signer,
        walletAddress,
      });
      // reloadWallet?.();
      // reloadIdentity?.();
    }
  }, [
    hasWalletAddress,
    accountAddress,
    wagmiAddress,
    reloadWallet,
    reloadIdentity,
  ]);

  console.log({
    accountAddress,
    signer,
    isConnected,
    isConnecting,
    isDisconnected,
    identity,
    isLoggedIn,
    hasLoggedOut,
    isLoggingOut,

    hasWalletAddress,
    hasAccountAddress,
    walletAddress,
  });

  // useAsync(async () => {
  //   if (isDisconnected) {
  //     await invalidateAllQueries({ masa, signer, walletAddress });
  //   }
  // }, [isDisconnected, masa, signer, walletAddress]);
  return {
    accountAddress,
    signer,
    isConnected,
    isConnecting,
    isDisconnected,
    identity,
    soulnames,
    isLoggedIn,
    hasLoggedOut,
    isLoggingOut,

    hasWalletAddress,
    hasAccountAddress,
    walletAddress,
  };
};
