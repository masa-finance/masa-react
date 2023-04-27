import React from 'react';
import { MasaProvider } from '../../../../provider';
import { Meta, StoryObj } from '@storybook/react';
import { Gallery } from '.';
import { GalleryItem } from './galleryItem';


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
  title: 'Gallery',
  component: Gallery,
  argTypes: {},
  decorators: [
    (Story) => (
      <>
        <MasaProvider
          company={'Masa'}
          forceNetwork={'alfajores'}
          customGallerySBT={[customRenderPokeSBT]}
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
