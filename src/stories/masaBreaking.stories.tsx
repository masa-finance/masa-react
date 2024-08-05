import type { Args, Meta } from '@storybook/react';

import React from 'react';
import '../styles.scss';
import './stories.scss';
import 'react-json-view-lite/dist/index.css';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import MasaWagmiRainbowkitProvider from '../provider/masa-wagmi-rainbowkit-provider';

const meta: Meta = {
  title: 'Wallet And Network',
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
  return (
    <>
      <h1>Rainbowkit + Wagmi + Viem Update 2.x</h1>

      <ul>
        <ConnectButton />
      </ul>
    </>
  );
};

const Component = (): JSX.Element => {
  return (
    <section>
      <NetworkInfo />
    </section>
  );
};

const TemplateNewMasaState = (props: Args) => (
  <MasaWagmiRainbowkitProvider>
    <Component {...props} />
  </MasaWagmiRainbowkitProvider>
);

export const RainbowkitWagmiViemUpdate = TemplateNewMasaState.bind({
  options: { scope: [] },
});
