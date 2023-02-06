// @ts-ignore
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
  const { connect, missingProvider, loggedIn, handleLogout } = useMasa();

  console.log({ missingProvider });

  const handleConect = useCallback(() => {
    connect?.({
      scope: [],
      callback: function () {
        alert('hello hello connected');
      },
    });
  }, [connect]);

  const loadCR = async (): Promise<void> => {
    await queryClient.invalidateQueries('wallet');
  };

  const mintGreen = async (): Promise<void> => {
    // todo
  };

  return (
    <>
      <h1>SDK Tester!</h1>

      <button onClick={handleConect}>Use Masa!</button>
      <button onClick={loadCR}>Invalidate Wallet</button>
      <button onClick={mintGreen}>Mint green</button>
      {loggedIn && (
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
