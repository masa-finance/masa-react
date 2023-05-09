/**
 * quick collector object for account state;
 */

import { Masa } from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';
import { ConnectorData, useAccount } from 'wagmi';
import { useLogout } from './hooks';
import { useEffect, useMemo, useState } from 'react';

export const useAccountState = ({
  masa,
  walletAddress,
  signer,
  identity,
  isLoggedIn,
  hasWalletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
  signer?: Signer;
  isLoggedIn?: boolean;
  identity?: {
    identityId?: string;
    address?: string;
  };
  hasWalletAddress?: boolean;
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
  useEffect(() => {
    const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
      if (account) {
        console.log('new account', account);
        setAccountAddress(account);
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
  }, [activeConnector]);

  const hasAccountAddress = useMemo(() => {
    return !!accountAddress;
  }, [accountAddress]);

  useEffect(() => {
    // * initial state, just make sure walletAddress is passed to account address
    // * if we are initializing
    // * TODO: remove this logic once proper walletAddress scoping is in place
    if (walletAddress && !accountAddress && !isDisconnected) {
      console.log('setting account address to wallet address', walletAddress);
      setAccountAddress(walletAddress);
    }
  }, [walletAddress, accountAddress, wagmiAddress, isDisconnected]);

  return {
    accountAddress,
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
  };
};
