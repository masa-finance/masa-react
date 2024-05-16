import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Args, Meta } from '@storybook/react';
import type { Chain } from 'wagmi';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import { darkStyles, JsonView } from 'react-json-view-lite';
import { SoulNameDetails } from '@masa-finance/masa-sdk';
import { useAsync } from 'react-use';
import '../styles.scss';
import './stories.scss';
import { useConfig } from '../base-provider';
import 'react-json-view-lite/dist/index.css';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useNetwork } from '../wallet-client/network/use-network';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useIdentity } from '../masa/use-identity';
import { useSoulNames } from '../masa/use-soulnames';
import { MasaProvider } from '../masa-provider';
import { useSession } from '../masa/use-session';

import { useWalletClient } from '../wallet-client/wallet-client-provider';
import { AllNetworks } from '../config';

const meta: Meta = {
  title: 'Masa Complete',
  // component: () => <div />,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;

const NetworkInfo = () => {
  const {
    switchNetwork,
    switchingToChain,
    canProgrammaticallySwitchNetwork,
    activeChain,
    activeNetwork,
    isSwitchingChain,
    chains,
    isActiveChainUnsupported,
  } = useNetwork();
  return (
    // skipcq: JS-0415
    <ul>
      <h3>Chain / Network</h3>
      <li>Chain: {activeChain?.name}</li>
      <li>chain-id: {activeChain?.id}</li>
      <li>activeNetwork: {String(activeNetwork)}</li>
      <li>isSwitchingChain: {String(isSwitchingChain)}</li>
      <li>switchingToChain: {String(switchingToChain)}</li>
      <li>
        canProgrammaticallySwitchNetwork:{' '}
        {String(canProgrammaticallySwitchNetwork)}
      </li>
      <li>isActiveChainUnsupported: {String(isActiveChainUnsupported)}</li>

      <li style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <ul style={{ flexBasis: '30%' }}>
          <h3>Available Chains</h3>
          {chains.map((chain) => (
            <li key={chain.name}>
              <span>{chain.name}</span>
            </li>
          ))}
        </ul>
        <ul
          style={{
            flexDirection: 'row',

            alignItems: 'center',
            justifyContent: 'center',
            flexBasis: '66%',
            flexWrap: 'wrap',
          }}
        >
          <h3 className="flex-100">Switch Network</h3>
          {chains.map((chain: Chain) => {
            const onClick = () => {
              console.log({ chain });
              try {
                switchNetwork?.(chain.id);
              } catch (error: unknown) {
                console.error({ error });
              }
            };

            return (
              <li
                style={{
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                key={chain.name}
              >
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    fontSize: '16px',
                  }}
                  disabled={
                    !canProgrammaticallySwitchNetwork ||
                    chain.id === activeChain?.id
                  }
                  type="button"
                  onClick={onClick} // skipcq: JS-0417
                >
                  Switch to {chain.testnet ? 'Testnet' : ''} {chain.name}
                </button>
              </li>
            );
          })}
        </ul>
      </li>
    </ul>
  );
};

const WalletInfo = () => {
  const {
    address,
    previousAddress,
    // provider,
    // signer,
    connector,
    isConnected,
    isConnecting,
    isDisconnected,
    openConnectModal,
    openChainModal,
    openAccountModal,
    disconnect,
    shortAddress,
    // disconnectAsync,
    isLoadingSigner,
    isLoadingBalance,
    balance,
  } = useWallet();

  return (
    // skipcq: JS-0415
    <ul className="row wrap">
      <li className="flex-50">
        <ul>
          <h3>Wallet</h3>
          <li>address: {String(address)}</li>
          <li>previousAddress: {String(previousAddress)}</li>
          <li>shortAddress: {String(shortAddress)}</li>
          <li>activeConnector: {String(connector?.name)}</li>
          <li>isConnected: {String(isConnected)}</li>
          <li>isConnecting: {String(isConnecting)}</li>
          <li>isDisconnected: {String(isDisconnected)}</li>
          <li>isLoadingSigner: {String(isLoadingSigner)}</li>
          <li>isLoadingBalance: {String(isLoadingBalance)}</li>
          <li>balance: {balance}</li>
        </ul>
      </li>
      <li>
        <ul>
          <h3>Wagmi Functions</h3>
          <li>
            <button
              type="button"
              disabled={isDisconnected}
              onClick={
                disconnect as unknown as
                  | MouseEventHandler<HTMLButtonElement>
                  | undefined
              }
            >
              Disconnect
            </button>
          </li>
        </ul>
      </li>

      <li>
        <ul>
          <h3>RainbowKit</h3>
          <li>
            <button
              type="button"
              disabled={!openConnectModal}
              onClick={openConnectModal}
            >
              Open ConnectModal
            </button>
          </li>
          <li>
            <button
              type="button"
              disabled={!openAccountModal}
              onClick={openAccountModal}
            >
              Open AccountModal
            </button>
          </li>
          <li>
            <button
              type="button"
              disabled={!openChainModal}
              onClick={openChainModal}
            >
              Open ChainModal
            </button>
          </li>
        </ul>
      </li>
    </ul>
  );
};

const SessionInfo = () => {
  const {
    session,
    // loginSession,
    // logoutSession,
    sessionAddress,
    isLoggingIn,
    isLoggingOut,
    hasSession,
    isLoadingSession,
    // checkLogin,
  } = useSession();

  return (
    // skipcq: JS-0415
    <ul>
      <li>
        <ul>
          <h3>Session</h3>
          <li>isLoadingSession: {String(isLoadingSession)}</li>
          <li>hasSession: {String(hasSession)}</li>
          <li>sessionAddress: {String(sessionAddress)}</li>
          <li>isLoggingIn: {String(isLoggingIn)}</li>
          <li>isLoggingOut: {String(isLoggingOut)}</li>
          <li>
            Session: <br />
            <code>{JSON.stringify(session, null, 4)}</code>
          </li>

          {/* <li>Session User: {JSON.stringify(session?.user, null, 2)}</li>
            <li>Session Challenge: {session?.challenge}</li>
            <li>session cookie: {JSON.stringify(session?.cookie, null, 2)}</li> */}
        </ul>
      </li>
    </ul>
  );
};

const IdentityInfo = () => {
  const { isIdentityAvailableInNetwork, isLoadingIdentity, identity } =
    useIdentity();
  return (
    <ul>
      <h3>Identity</h3>
      <li>
        isIdentityAvailableInNetwork: {String(isIdentityAvailableInNetwork)}
      </li>
      <li>isLoadingIdentity: {String(isLoadingIdentity)}</li>
      <li>Identity: {String(JSON.stringify(identity, null, 4))}</li>
    </ul>
  );
};

const SoulnameCreditScoreInfo = () => {
  const { soulnames, isLoadingSoulnames, isSoulnameAvailableInNetwork } =
    useSoulNames();
  const { masa } = useMasaClient();

  const [soulnameDetails, setSoulnameDetails] = useState<SoulNameDetails[]>([]);

  useAsync(async () => {
    if (soulnames) {
      const snd = await Promise.all(
        soulnames.map((soulname) => masa?.soulName.loadSoulNameByName(soulname))
      );
      setSoulnameDetails(snd.filter(Boolean) as SoulNameDetails[]);
    }
  }, [soulnames]);

  return (
    // skipcq: JS-0415
    <ul>
      <h3>Soulnames</h3>
      <li>
        <ul>
          <li>
            isSoulnameAvailableInNetwork:
            {String(isSoulnameAvailableInNetwork)}
          </li>
          <li>isLoadingSoulnames: {String(isLoadingSoulnames)}</li>
          {soulnameDetails?.map((sn) => {
            const randomColor = `#${Math.floor(
              Math.random() * 16_777_215
            ).toString(16)}`;
            return (
              <li
                key={sn.metadata.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                }}
              >
                <code style={{ color: randomColor }}>
                  Soulname: {JSON.stringify(sn.metadata.name, null, 4)}
                </code>
                <code style={{ color: randomColor }}>
                  Owner: {JSON.stringify(sn.owner, null, 4)}
                </code>
              </li>
            );
          })}
        </ul>
      </li>
    </ul>
  );
};

const SessionButtons = () => {
  const {
    loginSessionAsync,
    logoutSession,
    checkLogin,
    hasSession,
    isLoadingSession,
  } = useSession();
  const { isDisconnected } = useWalletClient();
  return (
    // skipcq: JS-0415
    <ul>
      <h3>Session</h3>
      <li>
        <button
          disabled={!!hasSession || isDisconnected || isLoadingSession}
          type="button"
          onClick={loginSessionAsync}
        >
          Login Session RQ
        </button>
      </li>
      <li>
        <button
          disabled={!hasSession || isLoadingSession}
          type="button"
          onClick={logoutSession}
        >
          Logout Session
        </button>
      </li>
      <li>
        <button
          disabled={isDisconnected || isLoadingSession}
          type="button"
          onClick={
            checkLogin as unknown as
              | MouseEventHandler<HTMLButtonElement>
              | undefined
          }
        >
          Check Login
        </button>
      </li>
    </ul>
  );
};

const MasaInfo = () => {
  const { activeNetwork, activeChainId } = useNetwork();
  const { masaAddress, masaNetwork } = useMasaClient();

  return (
    // skipcq: JS-0415
    <>
      <ReactQueryDevtools initialIsOpen={false} styleNonce={'rq-debug'} />
      <ul>
        <h3>Masa</h3>
        <li>
          <ul>
            <h3>Masa</h3>
            <li>masaAddress: {masaAddress}</li>

            <li>masaNetwork: {masaNetwork}</li>
            <li>activeNetwork: {activeNetwork}</li>
            <li>activeChainId: {activeChainId}</li>
          </ul>
        </li>
      </ul>
    </>
  );
};

const Component = (): JSX.Element => {
  const config = useConfig();
  const { masa } = useMasaClient();

  const shouldExpandNode = useCallback(
    (level: number): boolean => level <= 0,
    []
  );

  // SupportedNetworks
  return (
    // skipcq: JS-0415
    <section>
      <WalletInfo />
      <NetworkInfo />
      <MasaInfo />
      {/* <SessionInfoNew /> */}
      <SessionButtons />
      <SessionInfo />
      <IdentityInfo />

      <SoulnameCreditScoreInfo />
      <h3>Config</h3>
      <ul
        style={{
          flexDirection: 'row',
        }}
      >
        <li>
          <h4>Masa Config</h4>
          <div
            style={{
              textAlign: 'left',
              alignSelf: 'flex-start',
            }}
          >
            <JsonView
              data={config}
              shouldExpandNode={shouldExpandNode}
              style={{ ...darkStyles }}
            />
          </div>
        </li>
        <li>
          <h4>Masa SDK</h4>
          <div
            style={{
              textAlign: 'left',
              alignSelf: 'flex-start',
            }}
          >
            <JsonView
              data={masa ?? {}}
              shouldExpandNode={shouldExpandNode}
              style={{ ...darkStyles }}
            />
          </div>
        </li>
      </ul>
    </section>
  );
};

const TemplateNewMasaState = (props: Args) => (
  <MasaProvider
    config={{
      forceChain: 'base',
      allowedNetworkNames: AllNetworks,
      masaConfig: {
        networkName: 'base',
      },
    }}
  >
    <Component {...props} />
  </MasaProvider>
);

export const MasaComplete = TemplateNewMasaState.bind({
  options: { scope: [] },
});
