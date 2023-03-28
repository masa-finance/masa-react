import React, { useCallback, useMemo, useState } from 'react';
import { useMasa } from '../../../../provider';
import { Spinner } from '../../../spinner';

export const InterfaceAuthenticate = (): JSX.Element => {
  const { company, handleLogin, walletAddress, isLoading } = useMasa();

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

      default:
        return `Your wallet is now connected. Start your soulbound journey by minting
          a Masa Soulbound Identity and claiming a unique Masa Soul Name.`;
    }
  }, [company]);

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
