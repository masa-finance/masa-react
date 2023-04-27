/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React, { useCallback, useEffect } from 'react';
import { MasaProvider, ModalComponent, queryClient, useMasa } from '../src';
import { Args, Meta, Story } from '@storybook/react';
import InterfaceMasaGreen from '../src/components/masa-interface/pages/masa-green';
import { Messages, PaymentMethod } from '@masa-finance/masa-sdk';
import { PokeSSSBT, PokeSSSBT__factory } from './typechain';

const pokeSSSBTAddress = '0xD1C64fa4aDc003Ed92A10558572CbC499C7cA18A'; // sbt address

// sbt friendly name
const name = 'PokeSSSBT3';

// types collection using for verification
const types = {
  Mint: [
    { name: 'to', type: 'address' },
    { name: 'authorityAddress', type: 'address' },
    { name: 'signatureDate', type: 'uint256' },
  ],
};

const paymentMethod: PaymentMethod = 'ETH';

const customRenderPokeSBT = {
  name: 'PokeSBT',
  address: '0xD1C64fa4aDc003Ed92A10558572CbC499C7cA18A',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    const apiUrl = sbt.tokenUri.replace('.json', '');
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    return {
      name: data.name,
      image: data.image,
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
    masa,
    customSBTs,
  } = useMasa();

  console.log({ customSBTs });
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

  const mintPK = useCallback(async () => {
    if (!masa) return;
    const to = await masa.config.wallet.getAddress();
    const res = await fetch('http://localhost:4000/pokemons/mint', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 36,
        wallet: to,
      }),
    });

    const { authorityAddress, signatureDate, signature, pokemon } =
      await res.json();

    console.log({ pokemon });

    const value: {
      to: string;
      authorityAddress: string;
      signatureDate: number;
    } = {
      to,
      authorityAddress,
      signatureDate,
    };

    //@ts-ignore
    const { selfSovereignSBT, prepareMint } =
      await masa.contracts.sbt.connect<PokeSSSBT>(
        '0xD1C64fa4aDc003Ed92A10558572CbC499C7cA18A',
        PokeSSSBT__factory
      );
    if (!selfSovereignSBT) return;

    console.log('PREPARING MINT', {
      paymentMethod,
      name,
      types,
      value,
      signature,
      authorityAddress,
    });

    const prepareMintResults = await prepareMint(
      paymentMethod,
      name,
      types,
      value,
      signature,
      authorityAddress
    );

    if (!prepareMintResults) return;

    const { paymentAddress, price } = prepareMintResults;

    const mintParameters: [string, string, string, number, string] = [
      paymentAddress,
      to,
      authorityAddress,
      signatureDate,
      signature,
    ];

    const mintOverrides = {
      value: price,
    };

    console.log({ mintParameters, mintOverrides });

    const operation = 'mint(address,address,address,uint256,bytes)';

    console.log('FIRE OPERATION');

    // estimate gas
    const gasLimit = await selfSovereignSBT.estimateGas[operation](
      ...mintParameters,
      mintOverrides
    );

    console.log({ gasLimit });

    const transaction = await selfSovereignSBT[operation](...mintParameters, {
      ...mintOverrides,
      gasLimit,
    });

    console.log(Messages.WaitingToFinalize(transaction.hash));

    const receipt = await transaction.wait();

    console.log('RECEIPT', receipt);
    console.log('minted in block:', receipt.blockNumber);

    const resUpdate = await fetch('http://localhost:4000/pokemons/update', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txHash: transaction.hash,
        id: pokemon.insertedId,
      }),
    });

    console.log({ resUpdate });
    const dataUpdate = await resUpdate.json();

    console.log({ dataUpdate });
  }, [masa]);
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
      <button onClick={mintPK}>Mint a Pokemon</button>
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
        fullScreenGallery
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
