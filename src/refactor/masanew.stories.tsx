import buffer from 'buffer';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'; // eslint-disable-line import/no-extraneous-dependencies
import type { Args, Meta } from '@storybook/react';
import type { Chain } from 'wagmi';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { Button } from './ui';
import './ui/styles.scss';
import '../styles.scss';
import { useConfig } from './base-provider';
import { darkStyles, JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

import { useWallet } from './wallet-client/wallet/use-wallet';
import { useNetwork } from './wallet-client/network/use-network';
import { useMasaClient } from './masa-client/use-masa-client';
import { useIdentity } from './masa/use-identity';
import { useSoulNames } from './masa/use-soulnames';
import { useCreditScores } from './masa/use-credit-scores';
import { useGreen } from './masa/use-green';
import { useSBT } from './masa/use-sbt';
import MasaProvider from './masa-provider';
import { useSession } from './masa/use-session';
import { MasaQueryClientContext } from './masa-client/masa-query-client-context';

import {
  CreateCreditScoreModal,
  CreateIdentityModal,
  openGalleryModal,
} from './ui/components/modals';
import { useGreenModal } from './ui/components/modals/create-green/use-green-modal';
import { openCreateSoulnameModal } from './ui/components/modals/create-soulname/CreateSoulnameModal';
import { useWalletClient } from './wallet-client/wallet-client-provider';
import { useAuthenticate } from './ui/components/modals/authenticate/use-authenticate';
import { CustomGallerySBT } from './masa/interfaces';
import { SoulNameDetails } from '@masa-finance/masa-sdk';
import { useAsync } from 'react-use';
import { useMasa } from '../provider';

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
    // skipcq: JS-0415
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
                    !canProgramaticallySwitchNetwork ||
                    chain.id === activeChain?.id
                  }
                  type="button"
                  onClick={onClick} // skipcq: JS-
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
  const { masa } = useMasa();
  const { creditScores, isLoadingCreditScores } = useCreditScores();

  const [soulnameDetails, setSoulnameDetails] = useState<SoulNameDetails[]>([]);

  useAsync(async () => {
    if (soulnames) {
      const snd = await Promise.all(
        soulnames.map((soulname) => masa?.soulName.loadSoulNameByName(soulname))
      );
      setSoulnameDetails(snd.filter((sn) => Boolean(sn)) as SoulNameDetails[]);
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
  const noop = useCallback(() => {
    // noop
  }, []);

  return (
    // skipcq: JS-0415
    <>
      <ReactQueryDevtoolsPanel
        context={MasaQueryClientContext}
        setIsOpen={noop}
        onDragStart={noop}
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
  const { showChainingModal } = useGreenModal();
  const { identity } = useIdentity();
  const onLogout = useCallback(() => {
    if (hasSession) logoutSession();
    disconnect?.();
  }, [logoutSession, hasSession, disconnect]);

  const { openAuthModal } = useAuthenticate({
    onAuthenticateSuccess: () => console.log('SUCCESS IN USEAUTH'),
    onAuthenticateError: () => console.log('AUTHENTICATE ERROR'),
    onRegisterFinish: () => console.log('FINISH FROM OUTSIDE ?????'),
    onMintSuccess: () => console.log('MINT SUCCESS FROM OUTSIDE'),
    onMintError: () => console.log('MINT ERROR FROM OUTSIDE'),
    onError: () => console.log('CREATE SOULNAME ERROR'),
  });

  const onClickSoulname = useCallback(() => {
    openCreateSoulnameModal({
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
          onClick={() => openAuthModal()}
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
      <li>
        <Button
          type="button"
          onClick={() => NiceModal.show(CreateIdentityModal)}
        >
          Create Identity
        </Button>
      </li>
      <li>
        <Button
          type="button"
          onClick={() => NiceModal.show(CreateCreditScoreModal)}
        >
          Create Credit Score
        </Button>
      </li>
      <li>
        <Button type="button" onClick={showChainingModal}>
          Create Masa Green
        </Button>
      </li>
      <li>
        <Button type="button" onClick={openGalleryModal}>
          Gallery
        </Button>
      </li>
    </ul>
  );
};

const Component = (): JSX.Element => {
  const config = useConfig();
  const { sdk: masa } = useMasaClient();
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
              shouldInitiallyExpand={(number) => number <= 0 && true}
              style={{ ...darkStyles, ...{ alignItems: 'flex-start' } }}
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
              shouldInitiallyExpand={(number) => number <= 0 && true}
              style={{ ...darkStyles, ...{ alignItems: 'flex-start' } }}
            />
          </div>
        </li>
      </ul>
    </section>
  );
};

const GoodDollarSBT: CustomGallerySBT = {
  name: 'Good Dollar SBT',
  address: '0x814846364714bD2d66aD9433B34AE67754115963',
  network: 'alfajores',
  getMetadata: async (sbt: { tokenId: string; tokenUri: string }) => ({
    name: 'Good Dollar SBT',
    image: sbt.tokenUri,
    description: 'Good Dollar Token',
  }),
};

const SoulCircleSBT: CustomGallerySBT = {
  name: 'Masa Soul Circle',
  address: '0xeB05dca1A7e0E37E364B938d989fc0273Ff3bFCa',
  network: 'bsc',
  getMetadata: async (sbt: { tokenId: string; tokenUri: string }) => ({
    name: 'Masa Soul Circle',
    image: sbt.tokenUri,
    description: 'Masa Soul Circle',
  }),
};

const FearlessBoundTokenSBT: CustomGallerySBT = {
  name: 'Fearless Bound',
  address: '0xa3B54cAF1465dee624Df8F014d0adDd748e1B0bA',
  network: 'basegoerli',
  getMetadata: async (sbt: { tokenId: string; tokenUri: string }) => ({
    name: 'Fearless Bound',
    image: sbt.tokenUri,
    description: 'Fearless bound token',
  }),
};

const VaisselVoyageSBT: CustomGallerySBT = {
  name: 'Double Protocol SBT',
  address: '0x395E89F13656C7CaeB61574C83444EA055f2F924',
  network: 'basegoerli',
  getMetadata: async (sbt: { tokenId: string; tokenUri: string }) => ({
    name: 'Vaissel Voyage-Bound Token',
    image: sbt.tokenUri,
    description: 'Vaissel Voyage-Bound Token',
  }),
};

const CloudBaseSBT: CustomGallerySBT = {
  name: 'Cloud Base SBT',
  address: '0x4b97BeEEF092E0c76339E9E8A566823797ad80D3',
  network: 'basegoerli',
  getMetadata: async (sbt: { tokenId: string; tokenUri: string }) => ({
    name: 'Cloud Base SBT',
    image: sbt.tokenUri,
    description: 'Cloud Base Token',
  }),
};

const TemplateNewMasaState = (props: Args) => (
  <MasaProvider
    config={{
      allowedWallets: ['metamask', 'walletconnect'],
      forceChain: 'base',
      // contractAddressOverrides: {},
      allowedNetworkNames: [
        'goerli',
        'ethereum',
        'alfajores',
        'celo',
        'mumbai',
        'polygon',
        'bsctest',
        'bsc',
        'base',
        'basegoerli',
        'unknown',
      ],
      masaConfig: {
        networkName: 'base',
      },
      customSBTs: [
        GoodDollarSBT,
        SoulCircleSBT,
        VaisselVoyageSBT,
        CloudBaseSBT,
        FearlessBoundTokenSBT,
      ],
    }}
  >
    <Component {...props} />
  </MasaProvider>
);

export const NewMasaState = TemplateNewMasaState.bind({
  options: { scope: [] },
});
