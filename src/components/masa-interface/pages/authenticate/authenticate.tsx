import React, { useCallback, useMemo, useState } from 'react';
import { useMasa } from '../../../../provider';
import { Spinner } from '../../../spinner';

export const InterfaceAuthenticate = (): JSX.Element => {
  const { handleLogin, walletAddress, isLoading } = useMasa();

  const [copied, setCopied] = useState(false);

  const shortAddress = useMemo(() => {
    return `${walletAddress?.substring(0, 2)}...${walletAddress?.substring(
      walletAddress.length - 4,
      walletAddress.length
    )}`;
  }, [walletAddress]);

  const handleClipboard = useCallback(() => {
    if (walletAddress) {
      void navigator.clipboard.writeText(walletAddress);
      setCopied(true);
    }
  }, [walletAddress]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="interface-authenticate">
      <div>
        <h3 className="title">Wallet connected!</h3>
        <p className="connected-wallet">
          Your wallet is now connected. Start your soulbound journey by minting
          a Masa Soulbound Identity and claiming a unique Masa Soul Name.
        </p>

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
        <div className="dont-have-a-wallet">
          <p>
            Want to use a different wallet? Close this window and disconnect
            your wallet in Metamask to connect a new wallet
          </p>
        </div>
      </div>
    </div>
  );
};
