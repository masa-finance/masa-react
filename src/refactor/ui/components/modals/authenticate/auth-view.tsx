import React from 'react';

interface AuthViewProps {
  message: string | undefined;
  handleClipboard: () => void;
  copied: boolean;
  shortAddress: string;
  loginSessionAsync: () => void;
  isLoadingSigner?: boolean;
  hasSession: boolean | undefined | null;
  isConnected: boolean;
  switchWallet: () => void;
}

const AuthView = ({
  message,
  handleClipboard,
  copied,
  shortAddress,
  loginSessionAsync,
  isLoadingSigner,
  hasSession,
  isConnected,
  switchWallet,
}: AuthViewProps): JSX.Element => (
  <section className="interface-authenticate">
    <div>
      <h3 className="title">Wallet connected!</h3>
      <p className="connected-wallet">{message}</p>

      <p className="connected-wallet with-wallet">
        You are connected with the following wallet
        <span
          role="button"
          tabIndex={0}
          onClick={handleClipboard}
          onKeyDown={() => {}}
        >
          {copied ? 'Copied!' : shortAddress}
        </span>
      </p>
    </div>
    <div>
      <button
        type="button"
        className="masa-button authenticate-button"
        onClick={loginSessionAsync}
      >
        {isLoadingSigner ? 'loading...' : 'Get Started'}
      </button>

      <div className="dont-have-a-wallet">
        <p>
          Want to use a different wallet?
          {!hasSession && isConnected && (
            <span className="connected-wallet">
              <span
                role="button"
                tabIndex={0}
                className="authenticate-button"
                onClick={switchWallet}
                onKeyDown={() => {}}
              >
                Switch Wallet
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  </section>
);

export default AuthView;
