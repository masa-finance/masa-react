import React, { useCallback, useEffect, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';

import { Modal } from '../modal';
import { useAuthenticateModal } from './use-authenticate-modal';
import { ModalLoading } from '../ModalLoading';

export interface AuthenticateProps {
  onAuthenticateSuccess?: (payload: {
    address?: string;
    walletType?: string;
  }) => void;
  onAuthenticateError?: () => void;
}

export const Authenticate = ({
  onAuthenticateSuccess,
  onAuthenticateError,
}: AuthenticateProps): JSX.Element => {
  const modal = useModal();

  const {
    address,
    shortAddress,
    disconnect,
    openConnectModal,
    isLoadingSigner,
  } = useWallet();

  const [copied, setCopied] = useState(false);

  const switchWallet = useCallback(async () => {
    disconnect?.();
    await modal?.hide();
    openConnectModal?.();
  }, [modal, disconnect, openConnectModal]);

  const handleClipboard = useCallback(() => {
    if (address) {
      void navigator?.clipboard?.writeText?.(address);
      setCopied(true);
    }
  }, [address]);

  const {
    isAuthenticating,
    onAuthenticateStart,
    successMessage,
    needsWalletConnection,
    showAuthenticateView,
    showSwitchWalletButton,
    showConnectedView,
  } = useAuthenticateModal({
    onAuthenticateError,
    onAuthenticateSuccess,
  });

  useEffect(() => {
    if (needsWalletConnection && modal.visible) {
      openConnectModal?.();
    }

    let timeout: NodeJS.Timeout;
    if (modal.visible && !isAuthenticating && showConnectedView) {
      timeout = setTimeout(() => {
        modal.remove();
        // onClose?.();
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [
    needsWalletConnection,
    modal,
    showConnectedView,
    isAuthenticating,
    openConnectModal,
  ]);

  if (isAuthenticating) {
    return (
      <Modal>
        <ModalLoading titleText="Signing you in..." />
      </Modal>
    );
  }

  if (showAuthenticateView) {
    return (
      <Modal>
        <article className="interface-authenticate">
          <header>
            <h3 className="title">
              {isAuthenticating ? 'Signing you in ...' : 'Wallet connected!'}
            </h3>
            <p className="connected-wallet">{successMessage}</p>

            <p className="connected-wallet with-wallet">
              You are connected with the following wallet
              <span
                role="button"
                tabIndex={0}
                onClick={handleClipboard}
                onKeyDown={() => {}}
              >
                {copied ? 'Copied!' : shortAddress}
              </span>
            </p>
          </header>
          <section>
            <button
              type="button"
              className="masa-button authenticate-button"
              onClick={onAuthenticateStart}
            >
              {isLoadingSigner ? 'loading...' : 'Get Started'}
            </button>

            <div className="dont-have-a-wallet">
              <p>
                Want to use a different wallet?
                {showSwitchWalletButton && (
                  <span className="connected-wallet">
                    <span
                      role="button"
                      tabIndex={0}
                      className="authenticate-button"
                      onClick={switchWallet}
                      onKeyDown={() => {}}
                    >
                      Switch Wallet
                    </span>
                  </span>
                )}
              </p>
            </div>
          </section>
        </article>
      </Modal>
    );
  }

  return <div />;
};

export const AuthenticateModal = NiceModal.create(
  ({ onAuthenticateSuccess, onAuthenticateError }: AuthenticateProps) => (
    <Authenticate
      onAuthenticateSuccess={onAuthenticateSuccess}
      onAuthenticateError={onAuthenticateError}
    />
  )
);

export const openAuthenticateModal = ({
  onAuthenticateSuccess,
  onAuthenticateError,
}: AuthenticateProps) =>
  NiceModal.show(AuthenticateModal, {
    onAuthenticateSuccess,
    onAuthenticateError,
  });

export const hideAuthenticateModal = async () =>
  NiceModal.hide(AuthenticateModal);

export default AuthenticateModal;
