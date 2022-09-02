// @ts-ignore
import React from 'react';
import { AuthProvider } from '../src/common/components/auth-provider';

import { Meta, Story } from '@storybook/react';

const meta: Meta = {
  title: 'Auth',
  component: AuthProvider,
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

const Template: Story = () => (
  <AuthProvider>
    <></>
  </AuthProvider>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
