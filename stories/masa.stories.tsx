/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React, { useCallback } from 'react';
import { MasaProvider, ModalComponent, queryClient, useMasa } from '../src';
import { Args, Meta, Story } from '@storybook/react';
import InterfaceMasaGreen from '../src/components/masa-interface/pages/masa-green';
// import '../dist/css/styles.css';
import '../src/styles.scss';

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

const Component = ({ name }: { name?: string }): JSX.Element => {
  const {
    connect,
    isLoggedIn,
    handleLogout,
    switchNetworkNew,
    openMintSoulnameModal,
    openMintMasaGreen,
    openConnectModal,
    openAccountModal,
    openChainModal,

    openGallery,
    masa,
    openAuthenticateModal,
    openConnectedModal,
    openCreateCreditScoreModal,
    openCreateIdentityModal,
    openCreateSoulnameModal,
    openSuccessCreateIdentityModal,
    openSwitchChainModal,
    openInterfaceMasaGreen,
    logout,
  } = useMasa();

  const ModalOpens = {
    openAuthenticateModal,
    openConnectedModal,
    openCreateCreditScoreModal,
    openCreateIdentityModal,
    openCreateSoulnameModal,
    openSuccessCreateIdentityModal,
    openSwitchChainModal,
    openInterfaceMasaGreen,
  };

  const mintBadge = async () => {
    if (masa && masa.config) {
      const { mint } = await masa.asbt.connect(
        '0x120AEBA02b9e125b8C148F466B6417Bb88Cf3bDE'
      );

      console.log({ mint });
      if (mint) await mint('0x988055AA2038Fc8aB06E90CBB3E6BF5aEBe7b5Dc');
    }
  };

  const deployASBT = async () => {
    const address = await masa?.asbt.deploy(
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
        <h1>SDK Tester for {name}!</h1>

        <button onClick={handleConnect}>Use Masa!</button>
        <button onClick={() => openGallery?.()}> Open gallery</button>
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
        <button onClick={logout}>New Logout</button>
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
        <button onClick={(): void => switchNetworkNew?.('ethereum')}>
          Switch to Ethereum
        </button>
        <button onClick={(): void => switchNetworkNew?.('goerli')}>
          Switch to Goerli
        </button>

        <button onClick={(): void => switchNetworkNew?.('polygon')}>
          Switch to Polygon
        </button>
        <button onClick={(): void => switchNetworkNew?.('mumbai')}>
          Switch to Mumbai
        </button>
        <button onClick={(): void => switchNetworkNew?.('bsc')}>
          Switch to BSC
        </button>
        <button onClick={(): void => switchNetworkNew?.('bsctest')}>
          Switch to BSC Test
        </button>
        <button onClick={(): void => switchNetworkNew?.('celo')}>
          Switch to Celo
        </button>
        <button onClick={(): void => switchNetworkNew?.('alfajores')}>
          Switch to Alfajores
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
        {Object.keys(ModalOpens).map((key: string) => {
          return (
            <button key={key} onClick={() => ModalOpens[key]()}>
              {key}
            </button>
          );
        })}
      </div>
      {isLoggedIn && (
        <button onClick={(): Promise<void> => handleLogout?.()}>Logout</button>
      )}
    </div>
  );
};

const TemplateNoRainbowkit: Story = (props: Args) => {
  return (
    <>
      <MasaProvider
        company="Masa"
        walletsToUse={['metamask']}
        useRainbowKitWalletConnect={true}
        forceNetwork={'alfajores'}
      >
        <Component name="Old Connection" {...props} />
      </MasaProvider>
    </>
  );
};

const TemplateWithRainbowKit: Story = (props: Args) => {
  return (
    <>
      <MasaProvider
        company="Masa"
        walletsToUse={['metamask', 'valora', 'walletconnect']}
        useRainbowKitWalletConnect
        forceNetwork="alfajores"
        rainbowKitModalSize={'wide'}
        verbose={false}
      >
        <Component name="Rainbow Kit" {...props} />
      </MasaProvider>
    </>
  );
};

export const RainbowkitInterface = TemplateWithRainbowKit.bind({
  options: { scope: [] },
});

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const NoRainbowkitInterface = TemplateNoRainbowkit.bind({
  options: { scope: [] },
});

NoRainbowkitInterface.args = {};

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
