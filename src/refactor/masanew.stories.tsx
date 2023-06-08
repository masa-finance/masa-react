import type { Args, Meta } from '@storybook/react';
import React from 'react';
import { Button } from './ui';
import './ui/styles.scss';
import { useConfig } from './base-provider';
import MasaProvider from './masa-provider';
import { useWalletClient } from './wallet-client/wallet-client-provider';

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

const Component = ({ name }: { name?: string }): JSX.Element => {
  const { openConnectModal, address, connector, isConnected } =
    useWalletClient();
  const config = useConfig();
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>{name}</h1>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',

          padding: '4px',
        }}
      >
        <li>Address: {address}</li>
        <li>Connector: {connector?.name}</li>
        <li>isConnected?: {String(isConnected)}</li>
      </ul>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',

          padding: '4px',
        }}
      >
        <li>
          <Button
            type="button"
            onClick={() => console.log('config', { config })}
          >
            Log Config
          </Button>
        </li>
        <li>
          <Button
            type="button"
            onClick={() => {
              openConnectModal?.();
            }}
          >
            Open ConnectModal
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
      masaConfig: {},
    }}
  >
    <Component {...props} />
  </MasaProvider>
);

export const NewMasaState = TemplateNewMasaState.bind({
  options: { scope: [] },
});
