import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Spinner } from '../../spinner';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { useSession } from '../../../../masa/use-session';
import { useConfig } from '../../../../base-provider';

import { Modal } from '../modal';
import AuthView from './auth-view';
import ConnectedView from './connected-view';

export interface AuthenticateProps {
  onAuthenticate?: (payload: unknown) => void;
  onClose?: () => void;
  onError?: () => void;
  next?: FC<unknown>;
  closeOnSuccess?: boolean;
}

export const Authenticate = ({
  onAuthenticate,
  onClose,
  onError,
  closeOnSuccess,
  next,
}: AuthenticateProps): JSX.Element => {
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

  const handleLoginSession = useCallback(async () => {
    const result = await loginSessionAsync?.();

    if (!result) {
      return onError?.();
    }

    if (result && result.address) {
      onAuthenticate?.(result);

      if (closeOnSuccess) {
        await modal.hide();
        return onClose?.();
      }

      if (next) {
        await modal.hide();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await NiceModal.show(next);
      }
    }
    return result;
  }, [
    loginSessionAsync,
    onError,
    onAuthenticate,
    closeOnSuccess,
    next,
    modal,
    onClose,
  ]);

  const switchWallet = useCallback(() => {
    disconnect?.();
  }, [disconnect]);

  const copy = useMemo(() => {
    switch (company) {
      case 'Masa': {
        return {
          titleText: 'Starting your soulbound journey',
          message: `Your wallet is now connected. Start your soulbound journey by minting a Masa Soulbound Identity and claiming a unique Masa Soul Name.`,
        };
      }
      case 'Celo': {
        return {
          titleText: 'Starting your soulbound journey',
          message: `Your wallet is now connected. Start your journey by minting a Prosperity Passport and claiming a unique .celo domain name.`,
        };
      }
      case 'Base': {
        return {
          titleText: 'Starting your soulbound journey',
          mesage:
            'Your wallet is now connected. Start your Base Camp journey by claiming a unique .base domain name.',
        };
      }
      case 'Base Universe': {
        return {
          titleText: 'Starting your soulbound journey',
          message:
            'Your wallet is now connected. Start your Base Universe journey by claiming a unique .bu domain name.',
        };
      }
      default: {
        return {
          titleText: 'Starting your soulbound journey',
          message: `Your wallet is now connected. Start your soulbound journey by minting a Masa Soulbound Identity and claiming a unique Masa Soul Name.`,
        };
      }
    }
  }, [company]);

  const shortAddress = useMemo(() => {
    if (!address) return '';

    // eslint-disable-next-line unicorn/prefer-string-slice
    return `${address?.slice(0, 2) ?? ''}...${address.substring(
      address.length - 4,
      address.length
    )}`;
  }, [address]);

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
  }, [
    modal,
    openConnectModal,
    isConnected,
    hasSession,
    hasAddress,
    modal.visible,
    needsWalletConnection,
  ]);

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
          loginSessionAsync={handleLoginSession}
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
};

export const AuthenticateModal = NiceModal.create(
  ({
    onAuthenticate,
    onClose,
    onError,
    closeOnSuccess,
    next,
  }: AuthenticateProps) => (
    <Authenticate
      onAuthenticate={onAuthenticate}
      onClose={onClose}
      onError={onError}
      closeOnSuccess={closeOnSuccess}
      next={next}
    />
  )
);

export const openAuthenticateModal = ({
  onAuthenticate,
  onClose,
  onError,
  closeOnSuccess,
  next,
}: AuthenticateProps) =>
  NiceModal.show(AuthenticateModal, {
    onAuthenticate,
    onClose,
    onError,
    closeOnSuccess,
    next,
  });

export default AuthenticateModal;
