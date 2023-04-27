import React from 'react';
import { ICreditScore, IGreen, SoulNameDetails } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';
import { Tabs } from './tabs';
import { useMasa } from '../../../../provider';

export const types = {
  Mint: [
    { name: 'to', type: 'address' },
    { name: 'authorityAddress', type: 'address' },
    { name: 'signatureDate', type: 'uint256' },
  ],
};

interface Greens {
  tokenId: BigNumber;
  tokenUri: string;
  metadata?: IGreen | undefined;
}

interface CreditScores {
  tokenId: BigNumber;
  tokenUri: string;
  metadata?: ICreditScore | undefined;
}
export interface Tabs {
  items: SoulNameDetails[] | Greens[] | CreditScores[];
  render: (SBT: any) => JSX.Element;
  content: () => JSX.Element[];
  title: string;
}

export interface CustomGallerySBT {
  name: string;
  address: string;
  getMetadata: (item: { tokenId; tokenUri }) => Promise<{
    image: string;
    name: string;
    description: string;
  }>;
}
export const Gallery = ({ setIndex, context }) => {
  const { masa, connect } = useMasa();
  return (
    <div className="masa-gallery-container">
      {masa ? (
        <Tabs
          tabs={context.tabs}
          wrapperClassName={'masa-gallery'}
          onAdd={() => setIndex('addSbt')}
        />
      ) : (
        <div className="not-connected-message">
          <h2>It looks like you are not connected to Masa</h2>
          <button className="masa-button" onClick={() => connect?.()}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};
