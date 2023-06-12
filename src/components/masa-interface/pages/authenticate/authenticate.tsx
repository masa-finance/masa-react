import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMasa } from '../../../../provider';
import { Spinner } from '../../../spinner';
import { useAccount, useDisconnect } from 'wagmi';

export const InterfaceAuthenticate = (): JSX.Element => {
  const {
    company,
    handleLogin,
    accountAddress,
    isLoading,
    // setModalOpen,
    // openConnectModal,
    isLoggedIn,
    useRainbowKit,
    connect,
    isModalOpen,
  } = useMasa();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const switchWallet = useCallback(() => {
    console.log({ disconnect });
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    if (isModalOpen && isConnected && !isLoggedIn) {
      connect?.();
    }
  }, [connect, isConnected, isLoggedIn, isModalOpen]);
  const [copied, setCopied] = useState(false);

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

  const shortAddress = useMemo(() => {
    return `${accountAddress?.substring(0, 2)}...${accountAddress?.substring(
      accountAddress.length - 4,
      accountAddress.length
    )}`;
  }, [accountAddress]);

  const handleClipboard = useCallback(() => {
    if (accountAddress) {
      void navigator.clipboard.writeText(accountAddress);
      setCopied(true);
    }
  }, [accountAddress]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="interface-authenticate">
      <div>
        <h3 className="title">Wallet connected!</h3>
        <p className="connected-wallet">{message}</p>

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
          onClick={handleLogin}
        >
          {isLoading ? 'loading...' : 'Get Started'}
        </button>

        {useRainbowKit ? (
          <div className="dont-have-a-wallet">
            <p>
              Want to use a different wallet?
              {!isLoggedIn && isConnected && (
                <span className={'connected-wallet'}>
                  <span
                    className={'authenticate-button'}
                    onClick={switchWallet}
                  >
                    Switch Wallet
                  </span>
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className="dont-have-a-wallet">
            <p>
              Want to use a different wallet? Close this window and disconnect
              your wallet in Metamask to connect a new wallet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
