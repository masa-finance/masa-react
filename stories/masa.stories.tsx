/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React, { useCallback } from 'react';
import { MasaProvider, ModalComponent, queryClient, useMasa } from '../src';
import { Args, Meta, Story } from '@storybook/react';
import InterfaceMasaGreen from '../src/components/masa-interface/pages/masa-green';
const customRenderPokeSBT = {
  name: 'PokeSBT',
  address: '0xA5705C317367Ab3e17D0deACf530792745C29c10',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    const apiUrl = sbt.tokenUri.replace('.json', '');
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    return {
      name: data.name,
      image: data.sprites.front_default,
      description: '',
    };
  },
};
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
    openGallery,
  } = useMasa();

  const handleConnect = useCallback(() => {
    connect?.({
      scope: ['auth'],
      callback: function () {
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
    <>
      <h1>SDK Tester!</h1>

      <button onClick={handleConnect}>Use Masa!</button>
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
      <button onClick={() => openGallery?.()}> Open gallery </button>
      <button onClick={loadCR}>Invalidate Wallet</button>
      <button onClick={mintGreen}>Mint green</button>

      <div>
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
    </>
  );
};

const Template: Story = (props: Args) => {
  return (
    <>
      <MasaProvider
        company="Masa"
        forceNetwork={'goerli'}
        customGallerySBT={[customRenderPokeSBT]}
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
        customGallerySBT={[customRenderPokeSBT]}
        forceNetwork={'goerli'}
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
