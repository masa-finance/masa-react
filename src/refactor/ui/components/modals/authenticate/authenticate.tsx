import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from '../../spinner';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { useSession } from '../../../../masa/use-session';
import { useConfig } from '../../../../base-provider';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../modal';

export const InterfaceAuthenticate = NiceModal.create((): JSX.Element => {
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
  const needsAuthentication =
    isConnected && !hasSession && signer && hasAddress;
  const isConnectedState = hasSession && hasAddress;

  const [copied, setCopied] = useState(false);
  const [children, setChildren] = useState<null | JSX.Element>(null);

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

  const authInterface = (
    <section className="interface-authenticate">
      <div>
        <h3 className="title">Wallet connected!</h3>
        <p className="connected-wallet">{copy.message}</p>

        <p className="connected-wallet with-wallet">
          You are connected with the following wallet
          <span onClick={handleClipboard}>
            {copied ? 'Copied!' : shortAddress}
          </span>
        </p>
      </div>
      <div>
        <button
          className="masa-button authenticate-button"
          onClick={loginSessionAsync}
        >
          {isLoadingSigner ? 'loading...' : 'Get Started'}
        </button>

        <div className="dont-have-a-wallet">
          <p>
            Want to use a different wallet?
            {!hasSession && isConnected && (
              <span className="connected-wallet">
                <span className="authenticate-button" onClick={switchWallet}>
                  Switch Wallet
                </span>
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );

  const connectedInterface = (
    <section className="interface-connected">
      <section>
        <h3 className="title">{copy.titleText}</h3>
        <Spinner />
      </section>
    </section>
  );

  useEffect(() => {
    if (needsWalletConnection) {
      modal.remove();
      openConnectModal?.();
    }
    if (needsAuthentication) {
      setChildren(authInterface);
    }
    if (isConnectedState) {
      setChildren(connectedInterface);
    }
  }, [openConnectModal, isConnected, hasSession, hasAddress, modal.visible]);

  useEffect(() => {
    if (isConnectedState) {
      let timeout;
      if (modal.visible && !isLoadingSession) {
        timeout = setTimeout(() => {
          modal.hide();
        }, 3000);
      }

      return () => {
        clearTimeout(timeout);
      };
    }
    return;
  }, [isLoadingSession, modal.visible]);

  if (isLoadingSigner) {
    return <Spinner />;
  }

  return <Modal children={children} />;
});
