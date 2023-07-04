import React, { useCallback, useMemo } from 'react';
import { useMasa } from '../../../provider';
import { MasaLoading } from '../../masa-loading';
import { twitterLogo } from '../../../assets/twitterLogo';

const SuccessCreateIdentityModal = (): JSX.Element => {
  const { isLoading, setForcedPage, soulnames, company } = useMasa();

  const handleComplete = useCallback(() => {
    setForcedPage?.(null);
  }, [setForcedPage]);

  const title = useMemo(() => {
    switch (company) {
      case 'Masa': {
        return 'You have claimed your .soul domain and your Soulbound Identity has been minted.';
      }
      case 'Celo': {
        return 'You have claimed your .celo domain and your Prosperity Passport has been minted.';
      }

      case 'Base': {
        return 'You have claimed your .base domain name. Welcome to Base Camp ⛺️';
      }

      default: {
        return 'You have claimed your .soul domain and your Soulbound Identity has been minted.';
      }
    }
  }, [company]);

  const twitterText = useMemo(() => {
    switch (company) {
      case 'Masa': {
        return 'Tweet your .soul domain.';
      }
      case 'Celo': {
        return 'Tweet your .celo domain.';
      }
      case 'Base': {
        return 'Tweet your .base domain.';
      }

      default: {
        return 'Tweet your .soul domain';
      }
    }
  }, [company]);

  const tweetContentLink = useMemo(() => {
    switch (company) {
      case 'Masa': {
        return 'https://app.masa.finance';
      }
      case 'Celo': {
        if (soulnames && soulnames.length > 0) {
          return `https://raregems.io/celo/celo-domain-names/${soulnames[
            soulnames.length - 1
          ].tokenDetails.tokenId.toString()}`;
        } else {
          return undefined;
        }
      }

      case 'Base': {
        return 'https://app.basecamp.global';
      }
      default: {
        return 'https://app.masa.finance';
      }
    }
  }, [soulnames, company]);

  const twitterLink = useMemo(() => {
    switch (company) {
      case 'Masa': {
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.soul%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=SoulboundIdentity,Masa`;
      }
      case 'Celo': {
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.celo%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=ProsperityPassport,Celo,Masa`;
      }
      case 'Base': {
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.base%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=Basecamp,Base,Masa`;
      }
      default: {
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.soul%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=SoulboundIdentity,Masa`;
      }
    }
  }, [company, tweetContentLink]);

  if (isLoading) return <MasaLoading />;

  return (
    <div id="gtm_hurray_identity_minted" className="interface-create-identity">
      <h3 className="title">Hurray! 🎉</h3>
      <p className="subtitle">{title}</p>
      <a
        className="tweet-domain"
        href={twitterLink}
        target="_blank"
        rel="noreferrer"
      >
        <img src={twitterLogo} style={{ width: 40 }} alt="twitter" />{' '}
        {twitterText}
      </a>
      <button className="masa-button" onClick={handleComplete}>
        Go to dashboard
      </button>
    </div>
  );
};

export default SuccessCreateIdentityModal;
