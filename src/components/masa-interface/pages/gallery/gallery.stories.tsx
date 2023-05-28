import React from 'react';
import { MasaProvider } from '../../../../provider';
import { Meta, StoryObj } from '@storybook/react';
import { Gallery } from '.';
import { GalleryItem } from './galleryItem';

const customRenderWhaleSBT = {
  name: 'Solid World Whale SBT',
  address: '0xd843fB69473F77fF45502e1EB8733B6DD7feC98F',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    const apiUrl = sbt.tokenUri.replace('.json', '');

    return {
      name: 'Solid World Whale SBT',
      image: apiUrl,
      description: 'Verified Discord member',
    };
  },
};

const customRenderWhaleSBTProduction = {
  name: 'Solid World Whale SBT Production',
  address: '0xbf060cdfc820cbdafa6313fdb0807944b99a03b7',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    const apiUrl = sbt.tokenUri.replace('.json', '');

    return {
      name: 'Solid World Whale SBT',
      image: apiUrl,
      description: 'Verified Discord member',
    };
  },
};

const customPokeSBT = {
  name: 'PokeSBT',
  address: '0xa0f3c1971a4d4ec4Ef3983cce75B567a9004eF1B',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
    const apiUrl = sbt.tokenUri.replace('.json', '');
    const apiResponse = await fetch(apiUrl, { mode: 'cors' });
    const data = await apiResponse.json();

    return {
      name: data.name,
      image: data.image,
      description: '',
    };
  },
};

const DackieSBT = {
  name: 'Dackies SBT',
  address: '0xbA444542E493Ed497D9Ef7f2ed596244a1952Ba2',
  getMetadata: async function (sbt: { tokenId: string; tokenUri: string }) {
      return {
          name: 'Dackie quack SBT',
          image: sbt.tokenUri,
          description: 'Verified Discord member',
      }
  },
}

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
            customRenderWhaleSBTProduction,
            customPokeSBT,
            customRenderWhaleSBT,
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
