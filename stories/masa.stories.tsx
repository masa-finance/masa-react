/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React, { useCallback } from 'react';
import { MasaProvider, ModalComponent, queryClient, useMasa } from '../src';
import { Args, Meta, Story } from '@storybook/react';
import InterfaceMasaGreen from '../src/components/masa-interface/pages/masa-green';
import { Masa, Messages, loadSBTContract } from '@masa-finance/masa-sdk';
import { Contract } from 'ethers';
import { abi } from '../src/helpers/ASBT';

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
    openMintMasaGreen,
    openConnectModal,
    openAccountModal,
    openChainModal,

    openGallery,
    masa,
  } = useMasa();

  const mintBadge = async () => {
    if (masa && masa.config) {
      const sbtContract = await loadSBTContract(
        masa?.config,
        '0x120AEBA02b9e125b8C148F466B6417Bb88Cf3bDE'
      );

      console.log({ sbtContract });
      if (sbtContract)
        mintASBT(
          masa,
          sbtContract,
          '0x988055AA2038Fc8aB06E90CBB3E6BF5aEBe7b5Dc'
        );
    }
  };

  const mintASBT = async (masa: Masa, sbtContract: any, receiver: string) => {
    const [name, symbol] = await Promise.all([
      sbtContract.name(),
      sbtContract.symbol(),
    ]);

    console.log('Minting SBT on:');
    console.log(`Contract Name: '${name}'`);
    console.log(`Contract Symbol: '${symbol}'`);
    console.log(`Contract Address: '${sbtContract.address}'`);
    console.log(`To receiver: '${receiver}'`);

    const asbt = await new Contract(
      sbtContract.address,
      abi,
      masa.config.wallet
    ).deployed();

    const { wait, hash } = await asbt.mint(receiver);
    console.log(Messages.WaitingToFinalize(hash));

    const { logs } = await wait();

    const parsedLogs = masa.contracts.parseLogs(logs, [asbt]);

    const mintEvent = parsedLogs.find((log: any) => log.name === 'Mint');

    if (mintEvent) {
      const { args } = mintEvent;
      console.log(
        `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
      );
    }
  };

  const deployASBT = async () => {
    const address = await masa?.sbt.deployASBT(
      'Masa Ambassador',
      'AMASADOR',
      'https://i.imgur.com/bteC57K.png?token=',
      '0x988055AA2038Fc8aB06E90CBB3E6BF5aEBe7b5Dc'
    );

    console.log({ address });
  };

  const handleConnect = useCallback(() => {
    connect?.({
      scope: ['auth', 'soulname', 'identity'],
      callback: () => {
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          width: '50%',
        }}
      >
        <h1>SDK Tester!</h1>

        <button onClick={handleConnect}>Use Masa!</button>
        <button onClick={() => openGallery?.()}> Open gallery </button>
        <button
          onClick={() => openMintSoulnameModal?.(() => alert('MINTED HURRAY!'))}
        >
          Mint a MSN
        </button>
        <button
          onClick={() => openMintMasaGreen?.(() => alert('MINTED HURRAY!'))}
        >
          Mint a MGX
        </button>
        <button onClick={deployASBT}>Deploy ASBT</button>
        <button onClick={mintBadge}>Mint BADGE</button>

        <button onClick={loadCR}>Invalidate Wallet</button>
        <button onClick={mintGreen}>Mint green</button>
        <button
          onClick={() => {
            console.log('clickin', openConnectModal);
            openConnectModal?.();
          }}
        >
          Rainbowkit connect modalyarn w
        </button>
        <button
          onClick={() => {
            console.log('clickin', openAccountModal);
            openAccountModal?.();
          }}
        >
          Rainbowkit account info modal
        </button>
        <button
          onClick={() => {
            console.log('clickin', openChainModal);
            openChainModal?.();
          }}
        >
          Rainbowkit switch chain modal
        </button>
      </div>
      <div
        style={{
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50%',
        }}
      >
        <button onClick={(): void => switchNetwork?.('ethereum')}>
          Switch to Ethereum
        </button>
        <button onClick={(): void => switchNetwork?.('goerli')}>
          Switch to Goerli
        </button>
        <button onClick={(): void => switchNetwork?.('polygon')}>
          Switch to Polygon
        </button>
        <button onClick={(): void => switchNetwork?.('mumbai')}>
          Switch to Mumbai
        </button>
        <button onClick={(): void => switchNetwork?.('bsc')}>
          Switch to BSC
        </button>
        <button onClick={(): void => switchNetwork?.('bsctest')}>
          Switch to BSC Test
        </button>
        <button onClick={(): void => switchNetwork?.('celo')}>
          Switch to Celo
        </button>
        <button onClick={(): void => switchNetwork?.('alfajores')}>
          Switch to Alfajores
        </button>
      </div>

      {isLoggedIn && (
        <button onClick={(): void => handleLogout?.()}>Logout</button>
      )}
    </div>
  );
};

const Template: Story = (props: Args) => {
  return (
    <>
      <MasaProvider
        company="Masa"
        useRainbowKitWalletConnect={true}
        forceNetwork={'alfajores'}
      >
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

const MasaGreenTemplate: Story = (props: Args) => {
  return (
    <>
      <MasaProvider
        company="Masa"
        useRainbowKitWalletConnect={true}
        forceNetwork={'alfajores'}
      >
        <ModalComponent
          open={true}
          close={() => {
            console.log('Close');
          }}
          setOpen={() => {
            console.log('Open');
          }}
        >
          <InterfaceMasaGreen {...props} />
        </ModalComponent>
      </MasaProvider>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const MasaGreenInterface = MasaGreenTemplate.bind({
  options: { scope: [] },
});
