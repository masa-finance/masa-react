import React from 'react';
import { useMetamask } from '../../../../provider';

export const InterfaceConnector = ({
  disableMetamask,
}: {
  disableMetamask?: boolean;
}): JSX.Element => {
  const { connect } = useMetamask({ disabled: disableMetamask });

  return (
    <div className="interface-connect">
      <div>
        <h3 className="title">Select a wallet</h3>
        <p>
          By connecting your wallet, you agree to our{' '}
          <a href="/terms-and-conditions">Terms of Service</a> and{' '}
          <a
            href="https://www.masa.finance/privacy-policy"
            target="_blank"
            rel="noreferrer noopener"
          >
            Privacy Policy
          </a>
        </p>
      </div>
      <div className="masa-connectors">
        <div data-cy="metaMask" className="connector" onClick={connect}>
          <p>MetaMask</p>
          <img
            src={
              'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png'
            }
            className="connector-image"
          />
        </div>
        <div data-cy="walletConnect" className="connector disabled">
          <p>WalletConnect</p>
          <img
            src={'https://example.walletconnect.org/favicon.ico'}
            className="connector-image"
          />
        </div>
        <div data-cy="coinbaseWallet" className="connector disabled">
          <p>Coinbase Wallet</p>
          <img
            src={'https://avatars.githubusercontent.com/u/18060234?s=280&v=4'}
            className="connector-image"
          />
        </div>
      </div>
      <div className="dont-have-a-wallet">
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <p>I don't have a Wallet</p>
        </a>
      </div>
    </div>
  );
};
