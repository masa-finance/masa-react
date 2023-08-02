import React, { useCallback, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
// import { useAsync } from 'react-use';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { useSession } from '../../../../masa/use-session';

import { Modal } from '../modal';
import ConnectedView from './connected-view';
import { useAuthenticateModal } from './use-authenticate-modal';
import { ModalLoading } from '../ModalLoading';

export interface AuthenticateProps {
  onAuthenticateSuccess?: () => void;
  onAuthenticateError?: () => void;
  // onClose?: () => void;
  // next?: FC<unknown>;
  // closeOnSuccess?: boolean;
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

  const { isLoadingSession } = useSession();

  // const needsWalletConnection = !hasSession && !isConnected && !hasAddress;
  // const showAuthenticateView =
  //   isConnected && !hasSession && signer && hasAddress;
  // const showConnectedView = hasSession && hasAddress;

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

  // useAsync(async () => {
  //   if (needsWalletConnection) {
  //     modal.remove();
  //     openConnectModal?.();
  //   }
  // }, [modal, needsWalletConnection, openConnectModal]);

  if (needsWalletConnection) {
    return <>No Modal</>;
  }

  if (isLoadingSigner) {
    return (
      <Modal>
        BRUDER
        <ModalLoading titleText="Loading..." />
      </Modal>
    );
  }

  if (showConnectedView) {
    return (
      <Modal>
        <ConnectedView
          titleText="Starting your soulbound journey"
          modal={modal}
          isLoadingSession={isLoadingSession}
        />
      </Modal>
    );
  }

  if (showAuthenticateView) {
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
    </Modal>;
  }

  return <>ERROR</>;
};

export const AuthenticateModal = NiceModal.create(
  ({
    onAuthenticateSuccess,
    // onClose,
    onAuthenticateError,
  }: AuthenticateProps) => (
    <Authenticate
      onAuthenticateSuccess={onAuthenticateSuccess}
      onAuthenticateError={onAuthenticateError}
      // onClose={onClose}
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

export default AuthenticateModal;
