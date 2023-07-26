import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from '../../spinner';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { useSession } from '../../../../masa/use-session';
import { useConfig } from '../../../../base-provider';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../modal';
import AuthView from './auth-view';
import ConnectedView from './connected-view';

export const AuthenticateModal = NiceModal.create((): JSX.Element => {
  const modal = useModal();

  const {
    address,
    hasAddress,
    disconnect,
    isConnected,
    signer,
    openConnectModal,
    isLoadingSigner,
  } = useWallet();

  const { isLoadingSession, hasSession, loginSessionAsync } = useSession();
  const { company } = useConfig();

  const needsWalletConnection = !hasSession && !isConnected && !hasAddress;
  const showAuthenticateView =
    isConnected && !hasSession && signer && hasAddress;
  const showConnectedView = hasSession && hasAddress;

  const [copied, setCopied] = useState(false);

  const switchWallet = useCallback(() => {
    disconnect?.();
  }, [disconnect]);

  const copy = useMemo(() => {
    switch (company) {
      case 'Masa':
        return {
          titleText: 'Starting your soulbound journey',
          message: `Your wallet is now connected. Start your soulbound journey by minting a Masa Soulbound Identity and claiming a unique Masa Soul Name.`,
        };
      case 'Celo':
        return {
          titleText: 'Starting your soulbound journey',
          message: `Your wallet is now connected. Start your journey by minting a Prosperity Passport and claiming a unique .celo domain name.`,
        };
      case 'Base':
        return {
          titleText: 'Starting your soulbound journey',
          mesage:
            'Your wallet is now connected. Start your Base Camp journey by claiming a unique .base domain name.',
        };
      case 'Base Universe':
        return {
          titleText: 'Starting your soulbound journey',
          message:
            'Your wallet is now connected. Start your Base Universe journey by claiming a unique .bu domain name.',
        };
      default:
        return {
          titleText: 'Starting your soulbound journey',
          message: `Your wallet is now connected. Start your soulbound journey by minting a Masa Soulbound Identity and claiming a unique Masa Soul Name.`,
        };
    }
  }, [company]);

  const shortAddress = `${address?.slice(0, 2)}...${address?.substring(
    address?.length - 4,
    address?.length
  )}`;

  const handleClipboard = useCallback(() => {
    if (address) {
      void navigator.clipboard.writeText(address);
      setCopied(true);
    }
  }, [address]);

  useEffect(() => {
    if (needsWalletConnection) {
      modal.remove();
      openConnectModal?.();
    }
  }, [openConnectModal, isConnected, hasSession, hasAddress, modal.visible]);

  if (isLoadingSigner) {
    return <Spinner />;
  }

  return (
    <Modal>
      {showAuthenticateView && (
        <AuthView
          message={copy.message}
          handleClipboard={handleClipboard}
          copied={copied}
          shortAddress={shortAddress}
          loginSessionAsync={loginSessionAsync}
          isLoadingSigner={isLoadingSigner}
          hasSession={hasSession}
          isConnected={isConnected}
          switchWallet={switchWallet}
        />
      )}
      {showConnectedView && (
        <ConnectedView
          titleText={copy.titleText}
          modal={modal}
          isLoadingSession={isLoadingSession}
        />
      )}
    </Modal>
  );
});
