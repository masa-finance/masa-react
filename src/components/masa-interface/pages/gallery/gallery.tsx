import React from 'react';
import type {
  ICreditScore,
  IGreen,
} from '@masa-finance/masa-sdk';
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

export interface Greens {
  tokenId: BigNumber;
  tokenUri: string;
  metadata?: IGreen | undefined;
}

export interface CustomSBTs {
  tokenId: BigNumber;
  tokenUri: string;
  metadata?: { name: string; description: string; image: string } | undefined;
}

export interface CreditScores {
  tokenId: BigNumber;
  tokenUri: string;
  metadata?: ICreditScore | undefined;
}

export const Gallery = ({ context }) => {
  const { masa, connect } = useMasa();
  return (
    <div className="masa-gallery-container">
      {masa && context.tabs && context.tabs.length > 0 ? (
        <Tabs
          tabs={context.tabs}
          wrapperClassName="masa-gallery"
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
