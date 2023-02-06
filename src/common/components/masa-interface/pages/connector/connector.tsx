import React from 'react';
import { useMetamask } from '../../../../helpers/provider/use-metamask';

export const InterfaceConnector = ({ disable }: { disable?: boolean }) => {
  const { connect } = useMetamask({ disable });

  return (
    <div className="interface-connect">
      <div>
        <h3 className="title">Select a wallet</h3>
        <p>
          By connecting your wallet, you agree to our <a>Terms of Service</a>{' '}
          and <a>Privacy Policy</a>
        </p>
      </div>
      <div className="masa-connectors">
        <div className="connector" onClick={connect}>
          <p>MetaMask</p>
          <img
            src={
              'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png'
            }
            className="connector-image"
          />
        </div>
        <div className="connector disabled">
          <p>WalletConnect</p>
          <img
            src={'https://example.walletconnect.org/favicon.ico'}
            className="connector-image"
          />
        </div>
        <div className="connector disabled">
          <p>Ciubvase Wallet</p>
          <img
            src={'https://avatars.githubusercontent.com/u/18060234?s=280&v=4'}
            className="connector-image"
          />
        </div>
      </div>
      <div className="dont-have-a-wallet">
        <a>
          <p>I don't have a Wallet</p>
        </a>
      </div>
    </div>
  );
};
