import React from 'react';
import { MasaProvider } from '../../../../provider';
import { Meta, StoryObj } from '@storybook/react';
import { Gallery } from '.';
import { GalleryItem } from './galleryItem';

const customRenderWhaleSBT = {
  name: 'Solid World Whale SBT',
  address: '0xd843fB69473F77fF45502e1EB8733B6DD7feC98F',
  network: 'polygon',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    const apiUrl = sbt.tokenUri.replace('.json', '');

    return {
      name: 'Solid World Whale SBT',
      image: apiUrl,
      description: 'Verified Discord member',
    };
  },
};

const DackieSBT = {
  name: 'Dackies SBT',
  address: '0xbA444542E493Ed497D9Ef7f2ed596244a1952Ba2',
  network: 'polygon',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    return {
      name: 'Dackie quack SBT',
      image: sbt.tokenUri,
      description: 'Verified Discord member',
    };
  },
};

const AmbassadorOGSBT = {
  name: 'Masa Ambassador OG SBT',
  address: '0x376f5039Df4e9E9c864185d8FaBad4f04A7E394A',
  network: 'polygon',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    return {
      name: 'Masa Ambassador OG SBT',
      image: sbt.tokenUri,
      description: 'Ambassador Token',
    };
  },
};

const AmbassadorSBT = {
  name: 'Masa Ambassador SBT',
  address: '0x3F1EFED96Eb7f98F0618136133D795F5997ECEf4',
  network: 'polygon',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    return {
      name: 'Masa Ambassador SBT',
      image: sbt.tokenUri,
      description: 'Ambassador Token',
    };
  },
};

const GoodDollarSBT = {
  name: 'Good Dollar SBT',
  address: '0x3F1EFED96Eb7f98F0618136133D795F5997ECEf4',
  network: 'celo',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    return {
      name: 'Good Dollar SBT',
      image: sbt.tokenUri,
      description: 'Good Dollar Token',
    };
  },
};

const meta: Meta = {
  title: 'Gallery',
  component: Gallery,
  argTypes: {},
  decorators: [
    (Story) => (
      <>
        <MasaProvider
          company={'Masa'}
          customGallerySBT={[
            DackieSBT,
            customRenderWhaleSBT,
            GoodDollarSBT,
            AmbassadorSBT,
            AmbassadorOGSBT,
          ]}
        >
          <div className="masa-modal">
            <Story />
          </div>
        </MasaProvider>
      </>
    ),
  ],
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

type Story = StoryObj<typeof Gallery>;

export const Primary: Story = {
  render: () => <Gallery />,
};

export const Item: Story = {
  render: () => (
    <GalleryItem
      image={
        'https://images.ctfassets.net/soczmgyl79ye/6p8ZvjmQZRcC60uVWzJex9/74528d3beee14aa9071c51dc36dad873/Masa_Brand_post.png'
      }
      title={'Masa SBT'}
      description={'This is a Masa SBT'}
    />
  ),
};
