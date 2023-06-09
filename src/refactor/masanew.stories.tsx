import * as buffer from 'buffer';

import type { Args, Meta } from '@storybook/react';
import type { Chain } from 'wagmi';
import React from 'react';
import { Button } from './ui';
import './ui/styles.scss';
import { useConfig } from './base-provider';
import MasaProvider from './masa-provider';

import { useWallet } from './wallet-client/wallet/use-wallet';
import { useNetwork } from './wallet-client/network/use-network';

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
    isSwitchingChain,
    chains,
    isActiveChainUnsupported,
  } = useNetwork();
  return (
    <ul>
      <h3>Chain / Network</h3>
      <li>Chain: {activeChain?.name}</li>
      <li>chain-id: {activeChain?.id}</li>
      <li>isSwitchingChain: {String(isSwitchingChain)}</li>
      <li>switchingToChain: {String(switchingToChain)}</li>
      <li>
        canProgramaticallySwitchNetwork:{' '}
        {String(canProgramaticallySwitchNetwork)}
      </li>
      <li>isActiveChainUnsupported: {String(isActiveChainUnsupported)}</li>
      <li style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <ul
          className="width-50"
          style={{
            flexDirection: 'row',
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',

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
          <ul>
            <h3>Availible Chains</h3>
            {chains.map((chain) => (
              <li key={chain.name}>
                <span>{chain.name}</span>
              </li>
            ))}
          </ul>
        </ul>
        <ul className="width-50">
          <h3>Availible Chains</h3>
          {chains.map((chain) => (
            <li key={chain.name}>
              <span>{chain.name}</span>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};

const WalletInfo = () => {
  const {
    address,
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
          <li>address: {address}</li>
          <li>activeConnector: {connector?.name}</li>
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

const Component = (): JSX.Element => {
  const config = useConfig();
  return (
    <section>
      <WalletInfo />
      <NetworkInfo />
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
    verbose
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
