import React from 'react';
import { RestTester } from '../src/common/components/rest-tester';

import { Meta, Story } from '@storybook/react';

const meta: Meta = {
  title: 'Rest Tester',
  component: RestTester,
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

const Template: Story = () => <RestTester />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
