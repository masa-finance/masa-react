import * as buffer from 'buffer';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'; // eslint-disable-line import/no-extraneous-dependencies
import type { Args, Meta } from '@storybook/react';
import type { Chain } from 'wagmi';
import React from 'react';
import { Button } from './ui';
import './ui/styles.scss';
import { useConfig } from './base-provider';
import MasaProvider, { QcContext } from './masa-provider';

import { useWallet } from './wallet-client/wallet/use-wallet';
import { useNetwork } from './wallet-client/network/use-network';
// import { useIdentity } from './masa-feature/use-identity';
import { useSession } from './masa/use-session';
import { useMasaClient } from './masa-client/use-masa-client';
import { useIdentity } from './masa/use-identity';
import { useSoulNames } from './masa/use-soulnames';
import { useCreditScores } from './masa/use-credit-scores';
import { useGreen } from './masa/use-green';

// * nextjs fix
// * TODO: move this to index.ts file at some point
if (typeof window !== 'undefined') {
  window.Buffer = buffer.Buffer;
}

const meta: Meta = {
  title: 'Refactor Test',
  component: () => <div />,
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
    canProgramaticallySwitchNetwork,
    activeChain,
    activeNetwork,
    isSwitchingChain,
    chains,
    isActiveChainUnsupported,
  } = useNetwork();
  return (
    <ul>
      <h3>Chain / Network</h3>
      <li>Chain: {activeChain?.name}</li>
      <li>chain-id: {activeChain?.id}</li>
      <li>activeNetwork: {String(activeNetwork)}</li>
      <li>isSwitchingChain: {String(isSwitchingChain)}</li>
      <li>switchingToChain: {String(switchingToChain)}</li>
      <li>
        canProgramaticallySwitchNetwork:{' '}
        {String(canProgramaticallySwitchNetwork)}
      </li>
      <li>isActiveChainUnsupported: {String(isActiveChainUnsupported)}</li>

      <li style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <ul style={{ flexBasis: '30%' }}>
          <h3>Availible Chains</h3>
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
          {chains.map((chain: Chain) => (
            <li
              style={{
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={chain.name}
            >
              <Button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  fontSize: '16px',
                }}
                disabled={
                  !canProgramaticallySwitchNetwork ||
                  chain.id === activeChain?.id
                }
                type="button"
                onClick={() => {
                  console.log({ chain });
                  try {
                    switchNetwork?.(chain.id);
                  } catch (error: unknown) {
                    console.log({ e: error });
                  }
                }}
              >
                Switch to {chain.testnet ? 'Testnet' : ''} {chain.name}
              </Button>
            </li>
          ))}
        </ul>
        {/* <ul className="width-50" style={{ justifyContent: 'flex-start' }}>
          <h3>Availible Chains</h3>
          {chains.map((chain) => (
            <li key={chain.name}>
              <span>{chain.name}</span>
            </li>
          ))}
        </ul> */}
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
    // disconnectAsync,
    isLoadingSigner,
    isLoadingBalance,
    balance,
  } = useWallet();

  return (
    <ul className="row wrap">
      <li className="flex-50">
        <ul>
          <h3>Wallet</h3>
          <li>address: {String(address)}</li>
          <li>previousAddress: {String(previousAddress)}</li>
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
            <Button
              type="button"
              disabled={isDisconnected}
              onClick={() => {
                disconnect?.();
              }}
            >
              Disconnect
            </Button>
          </li>
        </ul>
      </li>

      <li>
        <ul>
          <h3>RainbowKit</h3>
          <li>
            <Button
              type="button"
              disabled={!openConnectModal}
              onClick={() => {
                openConnectModal?.();
              }}
            >
              Open ConnectModal
            </Button>
          </li>
          <li>
            <Button
              type="button"
              disabled={!openAccountModal}
              onClick={() => {
                openAccountModal?.();
              }}
            >
              Open AccountModal
            </Button>
          </li>
          <li>
            <Button
              type="button"
              disabled={!openChainModal}
              onClick={() => {
                openChainModal?.();
              }}
            >
              Open ChainModal
            </Button>
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
    // sessionAddress,
    isLoggingIn,
    isLoggingOut,
    hasSession,
    isLoadingSession,
    // checkLogin,
  } = useSession();

  return (
    <ul>
      <li>
        <ul>
          <h3>Session</h3>
          <li>isLoadingSession: {String(isLoadingSession)}</li>
          <li>hasSession: {String(hasSession)}</li>
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
  const { isIdentityAvailibleInNetwork, isLoadingIdentity, identity } =
    useIdentity();
  return (
    <ul>
      <h3>Identity</h3>
      <li>
        isIdentityAvailibleInNetwork: {String(isIdentityAvailibleInNetwork)}
      </li>
      <li>isLoadingIdentity: {String(isLoadingIdentity)}</li>
      <li>Identity: {String(JSON.stringify(identity, null, 4))}</li>
    </ul>
  );
};

const SoulnameCreditScoreInfo = () => {
  const { soulnames, isLoadingSoulnames } = useSoulNames();
  const { creditScores, isLoadingCreditScores } = useCreditScores();
  return (
    <>
      <ul>
        <h3>Soulnames</h3>
        <li>
          <ul>
            <li>isLoadingSoulnames: {String(isLoadingSoulnames)}</li>
            {soulnames?.map((sn) => (
              <li key={sn.metadata.name}>
                <code>Owner: {JSON.stringify(sn.owner, null, 4)}</code>
              </li>
            ))}
          </ul>
        </li>
      </ul>
      <ul>
        <h3>Credit Scores</h3>
        <li>
          <ul>
            <li>isLoadingCreditScores: {String(isLoadingCreditScores)}</li>
            {creditScores?.map((cs) => (
              <li key={cs.metadata?.properties.lastUpdated}>
                <code>{String(JSON.stringify(cs, null, 4))}</code>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </>
  );
};
const MasaInfo = () => {
  // const { identity, isLoadingIdentity } = useIdentity();
  const {
    loginSession,
    logoutSession,
    sessionAddress,
    hasSession,
    isLoadingSession,
    checkLogin,
  } = useSession();
  const { isDisconnected } = useWallet();
  const { activeNetwork, activeChainId } = useNetwork();
  const { masaAddress, masaNetwork } = useMasaClient();

  return (
    <>
      <ReactQueryDevtoolsPanel
        context={QcContext}
        setIsOpen={() => {}}
        onDragStart={() => {}}
        isOpen
        className="rq-debug"
        style={{ color: 'white' }}
      />
      <ul>
        <h3>Masa</h3>
        <li>
          <ul>
            <h3>Masa</h3>
            <li>masaAddress: {masaAddress}</li>
            <li>sessionAddress: {sessionAddress}</li>
            <li>masaNetwork: {masaNetwork}</li>
            <li>activeNetwork: {activeNetwork}</li>
            <li>activeChainId: {activeChainId}</li>
            {/* <h3>Identity</h3>
            <li>isLoadingIdentity: {String(isLoadingIdentity)}</li>
            <li>Identity Address: {identity?.address}</li>
            <li>Identity Id: {identity?.identityId?.toString()}</li> */}
          </ul>
        </li>
      </ul>

      <ul>
        <h3>Session</h3>
        <li>
          <Button
            disabled={!!hasSession || isDisconnected || isLoadingSession}
            type="button"
            onClick={() => loginSession() as unknown as () => void}
          >
            Login Session RQ
          </Button>
        </li>
        {/* <li>
          <Button
            disabled={!!hasSession}
            type="button"
            onClick={() => loginSession() as unknown as () => void}
          >
            Login Session
          </Button>
        </li> */}
        <li>
          <Button
            disabled={!hasSession || isLoadingSession}
            type="button"
            onClick={() => logoutSession()}
          >
            Logout Session
          </Button>
        </li>
        <li>
          <Button
            disabled={isDisconnected || isLoadingSession}
            type="button"
            onClick={() => checkLogin()}
          >
            Check Login
          </Button>
        </li>
      </ul>
      {/* <ul>
        <h3>Identity</h3>
        <li>
          <Button
            disabled={isDisconnected || isLoadingSession}
            type="button"
            onClick={() => checkLogin()}
          >
            Purchase Identity
          </Button>
        </li>
        <li>
          <Button
            disabled={isDisconnected || isLoadingIdentity}
            type="button"
            onClick={() => checkLogin()}
          >
            Purchase Identity and Soulname
          </Button>
        </li>
      </ul> */}
    </>
  );
};

const GreenInfo = () => {
  const { greens, isLoadingGreens } = useGreen();

  return (
    <ul>
      <h3>Greens</h3>
      <li>isLoadingGreens: {String(isLoadingGreens)}</li>
      <li>
        <ul>
          {greens?.map((green) => (
            <li key={green.metadata?.properties.tokenId}>
              <code>{JSON.stringify(green, null, 4)}</code>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};
const Component = (): JSX.Element => {
  const config = useConfig();
  return (
    <section>
      <WalletInfo />
      <NetworkInfo />
      <MasaInfo />
      <SessionInfo />
      <IdentityInfo />
      <SoulnameCreditScoreInfo />
      <GreenInfo />
      <ul>
        <h3>Config</h3>
        <li>
          <Button
            type="button"
            onClick={() =>
              console.log('config', { config, masaConfig: config.masaConfig })
            }
          >
            Log Config
          </Button>
        </li>
      </ul>
    </section>
  );
};

const TemplateNewMasaState = (props: Args) => (
  <MasaProvider
    config={{
      allowedWallets: ['metamask', 'valora', 'walletconnect'],
      forceChain: 'ethereum',
      allowedNetworkNames: [
        'goerli',
        'ethereum',
        'alfajores',
        'celo',
        'mumbai',
        'polygon',
        'bsctest',
        'bsc',
        'basegoerli',
        'unknown',
      ],
      masaConfig: {
        networkName: 'ethereum',
      },
    }}
  >
    <Component {...props} />
  </MasaProvider>
);

export const NewMasaState = TemplateNewMasaState.bind({
  options: { scope: [] },
});
