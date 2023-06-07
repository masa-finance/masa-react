import type { Args, Meta } from '@storybook/react';
import React from 'react';
import { Button } from './ui';
import './ui/styles.scss';

const meta: Meta = {
  title: 'Refactor Test',
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

const Component = ({ name }: { name?: string }): JSX.Element => {
  console.log('Created component', name);
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ul>
        <li>
          <Button type="button" onClick={() => console.log('button clicked')}>
            Open Connect
          </Button>
        </li>
      </ul>
    </section>
  );
};

const TemplateNewMasaState = (props: Args) => (
  <div>
    <Component {...props} />
  </div>
);

export const NewMasaState = TemplateNewMasaState.bind({
  options: { scope: [] },
});
