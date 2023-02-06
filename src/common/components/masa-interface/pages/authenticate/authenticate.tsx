import React, { useMemo } from 'react';
import { useMasa } from '../../../../helpers/provider/use-masa';
import { Spinner } from '../../../spinner';

export const InterfaceAuthenticate = (): JSX.Element => {
  const { handleLogin, walletAddress, identity, loading } = useMasa();

  const hasIdentity = useMemo(() => {
    return identity && identity?.identityId;
  }, [identity]);
  const shortAddress = useMemo(() => {
    return `${walletAddress?.substring(0, 2)}...${walletAddress?.substring(
      walletAddress.length - 4,
      walletAddress.length - 1
    )}`;
  }, [walletAddress]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="interface-authenticate">
      <div>
        <h3 className="title">Wallet connected!</h3>
        <p className="connected-wallet">
          Your wallet is connected you can now create an account by minting a
          Masa Soulbound Identity and Masa Soulname!
        </p>

        <p className="connected-wallet with-wallet">
          You are connected with the following wallet
          <span>{shortAddress}</span>
        </p>
      </div>
      <div>
        <button
          className="masa-button authenticate-button"
          onClick={handleLogin}
        >
          {loading ? 'loading...' : hasIdentity ? 'Sign in' : 'Register'}
        </button>
        <div className="dont-have-a-wallet">
          <a>
            <p>
              Want to use a different wallet? Close this window and disconnect
              your wallet in Metamask to connect a new wallet
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};
