import React, { useMemo, useState, useCallback } from 'react';
import { MasaLoading } from '../../masa-loading';
import { useConfig } from '../../../../base-provider';
import { useSoulNames } from '../../../../masa/use-soulnames';
import { useIdentityPurchase } from '../../../../masa/use-identity-purchase';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../modal';

import SuccessView from './success-view';
import HurrayView from './hurray-view';

interface CreateIdentityModalProps {
  handleComplete: () => void;
}

export const CreateIdentityModal = NiceModal.create(
  ({ handleComplete }: CreateIdentityModalProps): JSX.Element => {
    const modal = useModal();
    const { company } = useConfig();
    const { soulnames } = useSoulNames();
    const { purchaseIdentity } = useIdentityPurchase();

    const [isSuccessful, setIsSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const copy = useMemo(() => {
      switch (company) {
        case 'Masa':
          return {
            titleText:
              'You have claimed your .soul domain and your Soulbound Identity has been minted.',
            twitterText: 'Tweet your .soul domain',
            tweetContentLink: 'https://app.masa.finance',
          };
        case 'Celo':
          let tweetContentLink;
          if (soulnames && soulnames.length > 0) {
            tweetContentLink = `https://raregems.io/celo/celo-domain-names/${soulnames[
              soulnames.length - 1
            ].tokenDetails.tokenId.toString()}`;
          }
          return {
            titleText:
              'You have claimed your .celo domain and your Prosperity Passport has been minted.',
            twitterText: 'Tweet your .celo domain',
            tweetContentLink,
          };
        case 'Base':
          return {
            titleText:
              'You have claimed your .base domain name. Welcome to Base Camp ⛺️',
            twitterText: 'Tweet your .base domain',
            tweetContentLink: 'https://app.basecamp.global',
          };
        case 'Base Universe':
          return {
            titleText:
              'You have claimed your Base Universe .bu domain name. Welcome to Base Universe.',
            twitter: 'Tweet your .bu domain',
            tweetContentLink:
              'https://masa.finance/sbts/base-universe-soulname-token',
          };
        default:
          return {
            titleText:
              'You have claimed your Base Universe .bu domain name. Welcome to Base Universe.',
            twitterText: 'Tweet your .soul domain',
            tweetContentLink: 'https://app.masa.finance',
          };
      }
    }, [company]);

    const createIdentity = useCallback(async () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccessful(true);
      }, 3000);
      /* const createIdentityRes = await purchaseIdentity?.();

         * if (createIdentityRes) {
         *   setIsSuccessful(true);
         * } else {
         *   // handle Error case
         * } */
    }, [isSuccessful]);

    return (
      <Modal>
        {isSuccessful && (
          <SuccessView
            titleText={copy.titleText}
            twitterText={copy.twitterText}
            modal={modal}
          />
        )}
        {isLoading && <MasaLoading />}
        <HurrayView createIdentity={createIdentity} />
      </Modal>
    );
  }
);
