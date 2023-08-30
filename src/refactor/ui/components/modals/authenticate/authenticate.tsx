import React, { useCallback, useEffect, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { useSession } from '../../../../masa/use-session';

import { Modal } from '../modal';
import ConnectedView from './connected-view';
import { useAuthenticateModal } from './use-authenticate-modal';
import { ModalLoading } from '../ModalLoading';

export interface AuthenticateProps {
  onAuthenticateSuccess?: (payload: {
    address?: string;
    walletType?: string;
  }) => void;
  onAuthenticateError?: () => void;
  onAuthenticateFinish?: () => void;
}

export const Authenticate = ({
  onAuthenticateSuccess,
  onAuthenticateError,
  onAuthenticateFinish,
}: AuthenticateProps): JSX.Element => {
  const modal = useModal();

  const {
    address,
    shortAddress,
    disconnect,
    openConnectModal,
    isLoadingSigner,
  } = useWallet();

  const { isLoadingSession } = useSession();
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
    showConnectedView,
    showSwitchWalletButton,
  } = useAuthenticateModal({
    onAuthenticateError,
    onAuthenticateSuccess,
  });

  useEffect(() => {
    if (needsWalletConnection && modal.visible) {
      openConnectModal?.();
    }
  }, [needsWalletConnection, modal, openConnectModal]);

  if (isAuthenticating) {
    return (
      <Modal>
        <ModalLoading titleText="Signing you in..." />
      </Modal>
    );
  }

  if (showConnectedView) {
    return (
      <ConnectedView
        titleText="Starting your soulbound journey"
        modal={modal}
        loading={isLoadingSession}
        closeTimeoutMS={3000}
        onClose={onAuthenticateFinish}
      />
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
  ({
    onAuthenticateSuccess,
    onAuthenticateFinish,
    onAuthenticateError,
  }: AuthenticateProps) => (
    <Authenticate
      onAuthenticateSuccess={onAuthenticateSuccess}
      onAuthenticateError={onAuthenticateError}
      onAuthenticateFinish={onAuthenticateFinish}
    />
  )
);

export const openAuthenticateModal = ({
  onAuthenticateSuccess,
  onAuthenticateError,
  onAuthenticateFinish,
}: AuthenticateProps) =>
  NiceModal.show(AuthenticateModal, {
    onAuthenticateSuccess,
    onAuthenticateFinish,
    onAuthenticateError,
  });

export const hideAuthenticateModal = async () =>
  NiceModal.hide(AuthenticateModal);

export default AuthenticateModal;
