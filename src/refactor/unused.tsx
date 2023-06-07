import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './ui';
import MasaProvider from './masa-provider';

const Test = () => (
  <div>
    <h1>Testing</h1>
    <div>
      <Button type="button">Click me</Button>
    </div>
  </div>
);

const meta: Meta = {
  title: 'Refactor',
  component: Test,
  argTypes: {},
  decorators: [
    (Story) => (
      <MasaProvider
        config={{
          masaConfig: {},
        }}
      >
        <div>
          <Story />
        </div>
      </MasaProvider>
    ),
  ],
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

type Story = StoryObj<React.ReactNode>;

export const Refactor: Story = {
  render: () => <Test />,
};
