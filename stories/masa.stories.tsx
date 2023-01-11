// @ts-ignore
import React, { useCallback } from 'react';
import { MasaProvider } from '../src/common/helpers/provider/masa-provider';
import { Meta, Story } from '@storybook/react';
import { useMasa } from '../src/common/helpers/provider/use-masa';

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
  const { masa, connect, allowedForAllowlist, allowlistInfo, missingProvider } =
    useMasa();

  console.log({ missingProvider });

  const handleConect = useCallback(() => {
    connect?.({
      scope: ['identity', 'credit-score'],
      callback: function () {
        alert('hello hello connected');
      },
    });
  }, [connect]);

  const loadCR = async () => {
    const cr = await masa?.creditScore.create();
    console.log({ cr });
  };

  const checkAllowlist = async () => {
    console.log({ allowedForAllowlist, allowlistInfo });
  };

  return (
    <>
      <h1>SDK Tester!</h1>

      <button onClick={handleConect}>Use Masa!</button>
      <button onClick={loadCR}>Load CR</button>

      <button onClick={checkAllowlist}>Check Allowlist</button>
    </>
  );
};

const Template: Story = (props) => {
  return (
    <>
      <MasaProvider environment="local">
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
