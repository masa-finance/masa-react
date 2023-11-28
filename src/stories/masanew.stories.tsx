import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Args, Meta } from '@storybook/react';
import type { Chain } from 'wagmi';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import { darkStyles, JsonView } from 'react-json-view-lite';
import { SoulNameDetails } from '@masa-finance/masa-sdk';
import { useAsync } from 'react-use';
import { Button } from '../ui';
import '../styles.scss';
import './stories.scss';
import { useConfig } from '../base-provider';
import 'react-json-view-lite/dist/index.css';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useNetwork } from '../wallet-client/network/use-network';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useIdentity } from '../masa/use-identity';
import { useSoulNames } from '../masa/use-soulnames';
import { useCreditScores } from '../masa/use-credit-scores';
import { useGreen } from '../masa/use-green';
import { useSBT } from '../masa/use-sbt';
import MasaProvider from '../masa-provider';
import { useSession } from '../masa/use-session';

import { openCreateSoulnameModal } from '../ui/components/modals/create-soulname/CreateSoulnameModal';
import { useWalletClient } from '../wallet-client/wallet-client-provider';
import { useAuthenticate } from '../ui/components/modals/authenticate/use-authenticate';
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
                console.log({ e: error });
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
                <Button
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
                </Button>
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
            <Button
              type="button"
              disabled={isDisconnected}
              onClick={
                disconnect as unknown as
                  | MouseEventHandler<HTMLButtonElement>
                  | undefined
              }
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
              onClick={openConnectModal}
            >
              Open ConnectModal
            </Button>
          </li>
          <li>
            <Button
              type="button"
              disabled={!openAccountModal}
              onClick={openAccountModal}
            >
              Open AccountModal
            </Button>
          </li>
          <li>
            <Button
              type="button"
              disabled={!openChainModal}
              onClick={openChainModal}
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
  const { soulnames, isLoadingSoulnames } = useSoulNames();
  const { hasSession } = useSession();
  const { masa } = useMasaClient();
  const { creditScores, isLoadingCreditScores, getCreditScores } =
    useCreditScores();

  useAsync(async () => {
    console.log({ creditScores });
    if (creditScores || !hasSession || isLoadingCreditScores) return;

    await getCreditScores();
    console.log('ABO', { creditScores });
  }, [creditScores, isLoadingCreditScores, hasSession, getCreditScores]);
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
    <>
      <ul>
        <h3>Soulnames</h3>
        <li>
          <ul>
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
      <ul>
        <h3>Credit Scores</h3>
        <li>
          <ul>
            <li>isLoadingCreditScores: {String(isLoadingCreditScores)}</li>
            <li>Credit Scores Amount: {String(creditScores?.length)}</li>
            CreditScores:{' '}
            {creditScores?.length === 0
              ? 'No Credit Scores'
              : creditScores?.map((cs) => (
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

const SBTInfo = () => {
  const { SBTs, isLoadingSBTs } = useSBT({
    tokenAddress: '0x1fCE0Ae50a8900f09E4A437F33E95313225Bb4b7',
  });

  return (
    // skipcq: JS-0415
    <ul>
      <h3>SBTs</h3>
      <li>isLoadingSBTs: {String(isLoadingSBTs)}</li>
      <li>
        <ul>
          {(SBTs ?? []).map((sbt: unknown) => (
            <li key={String(sbt)}>
              <code>{JSON.stringify(sbt ?? null, null, 4)}</code>
            </li>
          ))}
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
        <Button
          disabled={!!hasSession || isDisconnected || isLoadingSession}
          type="button"
          onClick={loginSessionAsync}
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
          onClick={logoutSession}
        >
          Logout Session
        </Button>
      </li>
      <li>
        <Button
          disabled={isDisconnected || isLoadingSession}
          type="button"
          onClick={
            checkLogin as unknown as
              | MouseEventHandler<HTMLButtonElement>
              | undefined
          }
        >
          Check Login
        </Button>
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

const ModalFlow = () => {
  const { isDisconnected, disconnect } = useWallet();
  const { hasSession, logoutSession } = useSession();
  const { identity } = useIdentity();
  const onLogout = useCallback(() => {
    if (hasSession) void logoutSession();
    disconnect?.();
  }, [logoutSession, hasSession, disconnect]);

  const { openAuthModal } = useAuthenticate({
    onAuthenticateSuccess: () => console.log('SUCCESS IN USEAUTH'),
    onAuthenticateError: () => console.log('AUTHENTICATE ERROR'),
    onRegisterFinish: () => console.log('FINISH FROM OUTSIDE ?????'),
    onError: () => console.log('CREATE SOULNAME ERROR'),
  });

  const onClickSoulname = useCallback(() => {
    void openCreateSoulnameModal({
      onMintSuccess: () => console.log('MINT SUCCESS FROM OUTSIDE'),
      onMintError: () => console.log('MINT ERROR FROM OUTSIDE'),
      onRegisterFinish: () => console.log('REGISTER SOULNAME FINISHED OUTSIDE'),
      onSuccess: () => console.log('EVERYTHING WAS SUCCESSFUL'),
      onError: () => console.log('CREATE SOULNAME ERROR'),
      closeOnSuccess: true,
    });
  }, []);

  return (
    <ul>
      <h3>Modal Flows</h3>
      <li>
        <Button
          onClick={openAuthModal}
          type="button"
          disabled={!!hasSession && !!identity?.identityId}
        >
          {isDisconnected ? 'Connect' : 'Authenticate'}
        </Button>
      </li>
      <li>
        <Button type="button" disabled={isDisconnected} onClick={onLogout}>
          Disconnect
        </Button>
      </li>
      <li>
        <Button type="button" onClick={onClickSoulname}>
          Create Soul Name
        </Button>
      </li>
    </ul>
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

      <SBTInfo />
      <SoulnameCreditScoreInfo />
      <GreenInfo />
      <ModalFlow />
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
      allowedWallets: ['metamask', 'walletconnect'],
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
