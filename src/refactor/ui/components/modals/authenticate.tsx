import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMasa } from '../../../../provider';
import { Spinner } from '../spinner';
import { useWallet } from '../../../wallet-client/wallet/use-wallet';
import { useSession } from '../../../masa/use-session';

export const InterfaceAuthenticate = (): JSX.Element => {
  const {
    company,
    // setModalOpen,
    // openConnectModal,
    useRainbowKit,
    isModalOpen,
  } = useMasa();

  const {
    address,
    disconnect,
    isConnected,
    openConnectModal,
    isLoadingSigner,
  } = useWallet();
  const { hasSession, loginSessionAsync } = useSession();

  const [copied, setCopied] = useState(false);

  const switchWallet = useCallback(() => {
    disconnect?.();
  }, [disconnect]);

  useEffect(() => {
    if (isModalOpen && isConnected && !hasSession) {
      openConnectModal?.();
    }
  }, [openConnectModal, isConnected, hasSession, isModalOpen]);

  const message = useMemo(() => {
    switch (company) {
      case 'Masa':
        return `Your wallet is now connected. Start your soulbound journey by minting
    a Masa Soulbound Identity and claiming a unique Masa Soul Name.`;
      case 'Celo':
        return `Your wallet is now connected. Start your journey by minting a Prosperity Passport and claiming a unique .celo domain name.`;
      case 'Base':
        return 'Your wallet is now connected. Start your Base Camp journey by claiming a unique .base domain name.';
      case 'Base Universe':
        return 'Your wallet is now connected. Start your Base Universe journey by claiming a unique .bu domain name.';
      default:
        return `Your wallet is now connected. Start your soulbound journey by minting
          a Masa Soulbound Identity and claiming a unique Masa Soul Name.`;
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

  if (isLoadingSigner) {
    return <Spinner />;
  }

  return (
    <div className="interface-authenticate">
      <section>
        <h3 className="title">Wallet connected!</h3>
        <p className="connected-wallet">{message}</p>

        <p className="connected-wallet with-wallet">
          You are connected with the following wallet
          <span onClick={handleClipboard}>
            {copied ? 'Copied!' : shortAddress}
          </span>
        </p>
      </section>
      <section>
        <button
          className="masa-button authenticate-button"
          onClick={loginSessionAsync}
        >
          {isLoadingSigner ? 'loading...' : 'Get Started'}
        </button>

        {useRainbowKit ? (
          <div className="dont-have-a-wallet">
            <p>Want to use a different wallet?</p>
            {!hasSession && isConnected && (
              <span className="connected-wallet">
                <span className="authenticate-button" onClick={switchWallet}>
                  Switch Wallet
                </span>
              </span>
            )}
          </div>
        ) : (
          <div className="dont-have-a-wallet">
            <p>
              Want to use a different wallet? Close this window and disconnect
              your wallet in Metamask to connect a new wallet
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
