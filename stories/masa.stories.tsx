// @ts-ignore
import React, { useCallback, useState } from 'react';
import {
  MasaProvider,
  useMasa,
} from '../src/common/helpers/provider/masa-provider';
import { Meta, Story } from '@storybook/react';
import { Button } from 'antd';

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
  const { masa, setModalOpen } = useMasa();

  const handleLogin = useCallback(async () => {
    const result = await masa?.session.login();
    console.log({ result });
  }, [masa]);

  const handleLogout = useCallback(async () => {
    const result = await masa?.session.logout();
    console.log({ result });
  }, [masa]);

  const test = useCallback(async () => {
    const address = await masa?.config.wallet.getAddress();

    const balance = await masa?.account.getBalances(address as string);
    console.log({ balance });

    // identity id
    const identityId = await masa?.identity.load(address);
    console.log(`Identity ID: '${identityId}'`);

    console.log('ACC', await masa?.soulNames.list(address));
  }, [masa]);

  const handleCreateIdentity = useCallback(async () => {
    console.log('IDENTITY', masa?.identity);
    const result = await masa?.soulNames.create(
      'NewTestForSDK2.soul',
      1,
      'eth'
    );
    console.log({ result });
  }, [masa]);
  return (
    <>
      <h1>SDK Tester!</h1>

      <Button onClick={() => setModalOpen?.(true)}>Use Masa!</Button>
      <br />
      <Button onClick={handleLogin}>Login</Button>
      <Button onClick={handleLogout}>Logout</Button>

      <Button onClick={test}>test</Button>
      <Button onClick={handleCreateIdentity}>createIdentity</Button>
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
