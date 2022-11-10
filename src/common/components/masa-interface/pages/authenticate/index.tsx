import React from 'react';
import { useMasa } from '../../../../helpers/provider/use-masa';

export const InterfaceAuthenticate = () => {
  const { handleLogin } = useMasa();

  return (
    <div className="interface-authenticate">
      <div>
        <h3>Wallet connected!</h3>
        <p className="connected-paragraph">
          Now that you connected your wallet, you need to run through a little
          authentication process, it wont take much and only needs a signature
        </p>
      </div>
      <div>
        <button className="masa-button" onClick={handleLogin}>
          Authenticate with Masa servers
        </button>
        <div className="dont-have-a-wallet">
          <a>
            <p>I don't want to use this wallet</p>
          </a>
        </div>
      </div>
    </div>
  );
};
