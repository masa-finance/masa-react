import { MasaSBT } from '@masa-finance/masa-contracts-identity';
import { MasaSBTWrapper, NetworkName } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

// Use custom SBT
export interface Token {
  tokenId: BigNumber;
  tokenUri: string;
}
export interface Metadata {
  image: string;
  name: string;
  description: string;
}
export interface TokenWithMetadata extends Token {
  metadata: Metadata;
}
export interface HydratatedContracts extends FullContract {
  tokens: TokenWithMetadata[];
}

export interface FullContract
  extends CustomGallerySBT,
    MasaSBTWrapper<MasaSBT> {}

export interface GalleryMetadata {
  image?: string;
  name?: string;
  description?: string;
  tokenURI?: string;
}

export interface TabsInterface {
  items: GalleryMetadata[];
  title: string;
}

export interface CustomGallerySBT {
  name: string;
  address: string;
  network: NetworkName;
  getMetadata: (item: { tokenId; tokenUri }) => Promise<{
    image: string;
    name: string;
    description: string;
  }>;
}
