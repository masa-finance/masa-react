import type { Args, Meta } from '@storybook/react';

import React from 'react';
import '../ui/styles.scss';
import './stories.scss';
import 'react-json-view-lite/dist/index.css';
import '@rainbow-me/rainbowkit/styles.css';

import MasaUpdatedProvider from '../MasaUpdatedProvider';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
      <h1>Viem Wagmi Update</h1>

      <ul>
        <ConnectButton />
      </ul>
    </>
  );
};

const Component = (): JSX.Element => {
  return (
    // skipcq: JS-0415
    <section>
      <NetworkInfo />
    </section>
  );
};

const TemplateNewMasaState = (props: Args) => (
  <MasaUpdatedProvider>
    <Component {...props} />
  </MasaUpdatedProvider>
);

export const WagmiUpdate = TemplateNewMasaState.bind({
  options: { scope: [] },
});
