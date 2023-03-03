import React from 'react';
import { useMetamask } from '../../../../provider';
import { coinbase, metamask, walletconnect } from '../../../../assets';

export const InterfaceConnector = ({
  disableMetamask,
}: {
  disableMetamask?: boolean;
}): JSX.Element => {
  const { connectMetamask } = useMetamask({ disabled: disableMetamask });

  return (
    <div className="interface-connect">
      <div>
        <h3 className="title">Select a wallet</h3>
        <p>
          By connecting your wallet, you agree to our{' '}
          <a href="https://app.masa.finance/terms-and-conditions">
            Terms of Service
          </a>{' '}
          and{' '}
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
        <div data-cy="metaMask" className="connector" onClick={connectMetamask}>
          <p>MetaMask</p>
          <img alt="metamask" src={metamask} className="connector-image" />
        </div>
        <div data-cy="walletConnect" className="connector disabled">
          <p>WalletConnect</p>
          <img
            alt="walletconnect"
            src={walletconnect}
            className="connector-image"
          />
        </div>
        <div data-cy="coinbaseWallet" className="connector disabled">
          <p>Coinbase Wallet</p>
          <img alt="coinbase" src={coinbase} className="connector-image" />
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
