import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { MasaLoading } from '../../masa-loading';
import { useConfig } from '../../../../base-provider';
import { twitterLogo } from '../../../../../assets/twitterLogo';
import { useSoulNames } from '../../../../masa/use-soulnames';
import { useIdentityPurchase } from '../../../../masa/use-identity-purchase';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../modal';

interface CreateIdentityModalProps {
  handleComplete: () => void;
}

export const CreateIdentityModal = NiceModal.create(
  ({ handleComplete }: CreateIdentityModalProps): JSX.Element => {
    /* const { handlePurchaseIdentity, isLoading, setForcedPage } = useMasa(); */
    const modal = useModal();
    const { company } = useConfig();
    const { soulnames } = useSoulNames();
    const { purchaseIdentity } = useIdentityPurchase();

    const [children, setChildren] = useState<null | JSX.Element>(null);
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

    const successInterface = (
      <div
        id="gtm_hurray_identity_minted"
        className="interface-create-identity"
      >
        <h3 className="title">Hurray! 🎉</h3>
        <p className="subtitle">{copy.titleText}</p>
        <a className="tweet-domain" target="_blank" rel="noreferrer">
          <img src={twitterLogo} style={{ width: 40 }} alt="twitter" />{' '}
          {copy.twitterText}
        </a>
        <button className="masa-button" onClick={() => modal.hide()}>
          Go to dashboard
        </button>
      </div>
    );

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

    const hurrayInterface = (
      <section className="interface-create-identity">
        <h3 className="title">Hurray! 🎉</h3>
        <p className="subtitle">
          Congratulations you already have a Celo Domain Name in your wallet.
          You must now mint a Celo Prosperity Passport.
        </p>
        <button className="masa-button" onClick={createIdentity}>
          Get Prosperity Passport
        </button>
      </section>
    );

    useEffect(() => {
      setChildren(hurrayInterface);
      if (isSuccessful) {
        setChildren(successInterface);
      }
      if (isLoading) {
        setChildren(MasaLoading);
      }
    }, [isSuccessful, isLoading]);

    return <Modal children={children} />;
  }
);
