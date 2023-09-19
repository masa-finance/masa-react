import React, { useCallback, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useAsync } from 'react-use';
import { useMasa } from 'provider/use-masa';
import { MasaLoading } from '../../masa-loading';
import { useConfig } from '../../../../base-provider';
import { useSoulNames } from '../../../../masa/use-soulnames';
import { Modal } from '../modal';

import SuccessView from './success-view';
import HurrayView from './hurray-view';

interface Copy {
  titleText: string;
  twitterText: string;
  tweetContentLink: string;
}

export const CreateIdentityModal = NiceModal.create((): JSX.Element => {
  const modal = useModal();
  const { company } = useConfig();
  const { soulnames } = useSoulNames();
  const { masa } = useMasa();

  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copy, setCopy] = useState<Copy>();

  useAsync(async () => {
    let cpy: Copy;
    switch (company) {
      case 'Masa': {
        cpy = {
          titleText:
            'You have claimed your .soul domain and your Soulbound Identity has been minted.',
          twitterText: 'Tweet your .soul domain',
          tweetContentLink: 'https://app.masa.finance',
        };

        break;
      }
      case 'Celo': {
        let tweetContentLink = '';
        if (soulnames?.[0]) {
          const details = await masa?.soulName.loadSoulNameByName(soulnames[0]);
          const tweetLink = details?.tokenDetails.tokenId.toString();
          tweetContentLink = `https://raregems.io/celo/celo-domain-names/${
            tweetLink ?? ''
          }`;
        }

        cpy = {
          titleText:
            'You have claimed your .celo domain and your Prosperity Passport has been minted.',
          twitterText: 'Tweet your .celo domain',
          tweetContentLink,
        };
        break;
      }
      case 'Base': {
        cpy = {
          titleText:
            'You have claimed your .base domain name. Welcome to Base Camp ⛺️',
          twitterText: 'Tweet your .base domain',
          tweetContentLink: 'https://app.basecamp.global',
        };
        break;
      }
      case 'Base Universe': {
        cpy = {
          titleText:
            'You have claimed your Base Universe .bu domain name. Welcome to Base Universe.',
          twitterText: 'Tweet your .bu domain',
          tweetContentLink:
            'https://masa.finance/sbts/base-universe-soulname-token',
        };
        break;
      }
      default: {
        cpy = {
          titleText:
            'You have claimed your Base Universe .bu domain name. Welcome to Base Universe.',
          twitterText: 'Tweet your .soul domain',
          tweetContentLink: 'https://app.masa.finance',
        };
      }
    }

    setCopy(cpy);
  }, [company, masa?.soulName, soulnames]);

  const createIdentity = useCallback(async () => {
    setIsLoading(true);
    // purchaseIdentity?.()
    // onSuccessMint();
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
  }, []);

  return (
    <Modal>
      {isSuccessful && (
        <SuccessView
          titleText={copy?.titleText ?? ''}
          twitterText={copy?.twitterText}
          modal={modal}
        />
      )}
      {isLoading && <MasaLoading />}
      {!isSuccessful && !isLoading && (
        <HurrayView createIdentity={createIdentity} />
      )}
    </Modal>
  );
});
