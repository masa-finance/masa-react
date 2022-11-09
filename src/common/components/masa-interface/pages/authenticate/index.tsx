import React from 'react';
import { useMasa } from '../../../../helpers/provider/use-masa';

export const InterfaceAuthenticate = () => {
  const { handleLogin } = useMasa();

  return (
    <>
      <h3>Wallet connected!</h3>
      <p>
        Now that you connected your wallet, you need to run through a little
        authentication process, it wont take much and only needs a signature
      </p>

      <button className="masa-button" onClick={handleLogin}>
        Authenticate with Masa servers
      </button>
      <div className="dont-have-a-wallet">
        <a>
          <p>I don't want to use this wallet</p>
        </a>
      </div>
    </>
  );
};
