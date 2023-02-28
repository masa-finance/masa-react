import React, { useCallback } from 'react';
import { MasaProvider, queryClient, useMasa } from '../src';
import { Args, Meta, Story } from '@storybook/react';

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
  } = useMasa();

  const handleConnect = useCallback(() => {
    connect?.({
      scope: ['soulname', 'auth'],
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
    <>
      <h1>SDK Tester!</h1>

      <button onClick={handleConnect}>Use Masa!</button>
      <button
        onClick={() => openMintSoulnameModal?.(() => alert('MINTED HURRAY!'))}
      >
        Mint a soulname
      </button>
      <button onClick={loadCR}>Invalidate Wallet</button>
      <button onClick={mintGreen}>Mint green</button>

      <button onClick={(): void => switchNetwork?.(1)}>
        Switch to Ethereum
      </button>
      <button onClick={(): void => switchNetwork?.(5)}>Switch to Goerli</button>
      <button onClick={(): void => switchNetwork?.(137)}>
        Switch to Polygon
      </button>
      <button onClick={(): void => switchNetwork?.(56)}>Switch to BSC</button>
      <button onClick={(): void => switchNetwork?.(44787)}>
        Switch to Alfajores
      </button>

      {isLoggedIn && (
        <button onClick={(): void => handleLogout?.()}>Logout</button>
      )}
    </>
  );
};

const Template: Story = (props: Args) => {
  return (
    <>
      <MasaProvider company="Masa">
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
