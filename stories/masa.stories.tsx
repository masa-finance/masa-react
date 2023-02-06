import React, { useCallback } from 'react';
import {
  MasaProvider,
} from '../src/common/helpers/provider/masa-provider';
import { Meta, Story } from '@storybook/react';
import { useMasa } from '../src/common/helpers/provider/use-masa';
import { queryClient } from '../src/common/helpers/provider/masa-query-client';

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

const Component = (props) => {
  const {
    connect,
    missingProvider,
    handleGenerateGreen,
    loggedIn,
    handleLogout,
  } = useMasa();

  console.log({ missingProvider });

  const handleConect = useCallback(() => {
    connect?.({
      scope: [],
      callback: function () {
        alert('hello hello connected');
      },
    });
  }, [connect]);

  const loadCR = async () => {
    queryClient.invalidateQueries('wallet');
  };

  const mintGreen = async () => {
    // todo
  };

  return (
    <>
      <h1>SDK Tester!</h1>

      <button onClick={handleConect}>Use Masa!</button>
      <button onClick={loadCR}>Invalidate Wallet</button>
      <button onClick={mintGreen}>Mint green</button>
      {loggedIn && <button onClick={() => handleLogout?.()}>Logout</button>}
    </>
  );
};

const Template: Story = (props) => {
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
