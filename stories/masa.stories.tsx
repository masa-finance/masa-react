// @ts-ignore
import React, { useCallback, useState } from 'react';
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

const Component = () => {
  const { connect } = useMasa();

  const handleConect = useCallback(() => {
    connect?.(function () {
      alert('hello hello connected');
    });
  }, [connect]);

  return (
    <>
      <h1>SDK Tester!</h1>

      <button onClick={handleConect}>Use Masa!</button>
    </>
  );
};

const Template: Story = () => {
  return (
    <>
      <MasaProvider>
        <Component />
      </MasaProvider>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
