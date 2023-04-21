import '@rainbow-me/rainbowkit/styles.css';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React, { useCallback } from 'react';
import { MasaProvider, ModalComponent, queryClient, useMasa } from '../src';
import { Args, Meta, Story } from '@storybook/react';
import InterfaceMasaGreen from '../src/components/masa-interface/pages/masa-green';
import { useRainbowKit } from '../src/provider/use-rainbowkit';

const meta: Meta = {
  title: 'SDK Test',
  component: () => <></>,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Component = (): JSX.Element => {
  const {
    connect,
    isLoggedIn,
    handleLogout,
    switchNetwork,
    openMintSoulnameModal,
    openMintMasaGreen,
    openConnectModal,
    openAccountModal,
    openChainModal,
  } = useMasa();

  const handleConnect = useCallback(() => {
    connect?.({
      scope: ['auth', 'soulname', 'identity'],
      callback: function () {
        alert('hello hello connected');
      },
    });
  }, [connect]);

  const loadCR = async (): Promise<void> => {
    await queryClient.invalidateQueries(['wallet']);
  };

  const mintGreen = async (): Promise<void> => {
    // todo
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>SDK Tester!</h1>

      <button onClick={handleConnect}>Use Masa!</button>
      <button
        onClick={() => openMintSoulnameModal?.(() => alert('MINTED HURRAY!'))}
      >
        Mint a MSN
      </button>
      <button
        onClick={() => openMintMasaGreen?.(() => alert('MINTED HURRAY!'))}
      >
        Mint a MGX
      </button>
      <button onClick={loadCR}>Invalidate Wallet</button>
      <button onClick={mintGreen}>Mint green</button>
      <button
        onClick={() => {
          console.log('clickin', openConnectModal);
          openConnectModal?.();
        }}
      >
        Rainbowkit connect modal
      </button>
      <button
        onClick={() => {
          console.log('clickin', openAccountModal);
          openAccountModal?.();
        }}
      >
        Rainbowkit account modal
      </button>
      <button
        onClick={() => {
          console.log('clickin', openChainModal);
          openChainModal?.();
        }}
      >
        Rainbowkit chain modal
      </button>
      {/* <div>
        <button onClick={(): void => switchNetwork?.('ethereum')}>
          Switch to Ethereum
        </button>
        <button onClick={(): void => switchNetwork?.('goerli')}>
          Switch to Goerli
        </button>
        <button onClick={(): void => switchNetwork?.('polygon')}>
          Switch to Polygon
        </button>
        <button onClick={(): void => switchNetwork?.('mumbai')}>
          Switch to Mumbai
        </button>
        <button onClick={(): void => switchNetwork?.('bsc')}>
          Switch to BSC
        </button>
        <button onClick={(): void => switchNetwork?.('bsctest')}>
          Switch to BSC Test
        </button>
        <button onClick={(): void => switchNetwork?.('celo')}>
          Switch to Celo
        </button>
        <button onClick={(): void => switchNetwork?.('alfajores')}>
          Switch to Alfajores
        </button>
      </div> */}

      {isLoggedIn && (
        <button onClick={(): void => handleLogout?.()}>Logout</button>
      )}
    </div>
  );
};

const Template: Story = (props: Args) => {
  return (
    <>
      <MasaProvider company="Masa" forceNetwork={'goerli'}>
        <Component {...props} />
      </MasaProvider>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({
  options: { scope: [] },
});

Default.args = {};

const MasaGreenTemplate: Story = (props: Args) => {
  return (
    <>
      <MasaProvider company="Masa" forceNetwork={'goerli'}>
        <ModalComponent
          open={true}
          close={() => {
            console.log('Close');
          }}
          setOpen={() => {
            console.log('Open');
          }}
        >
          <InterfaceMasaGreen {...props} />
        </ModalComponent>
      </MasaProvider>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const MasaGreenInterface = MasaGreenTemplate.bind({
  options: { scope: [] },
});
