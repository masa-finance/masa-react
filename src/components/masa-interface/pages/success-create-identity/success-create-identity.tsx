import React, { useCallback, useMemo } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { twitterLogo } from '../../../../assets/twitterLogo';

export const InterfaceSuccessCreateIdentity = (): JSX.Element => {
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
      case 'Base Universe': {
        return 'You have claimed your Base Universe .bu domain name. Welcome to Base Universe.';
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
      case 'Base Universe': {
        return 'Tweet your .bu domain.';
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
        return soulnames && soulnames.length > 0
          ? `https://raregems.io/celo/celo-domain-names/${soulnames.at(
              -1
            ).tokenDetails.tokenId.toString()}`
          : undefined;
      }
      case 'Base': {
        return 'https://app.basecamp.global';
      }
      case 'Base Universe': {
        return 'https://masa.finance/sbts/base-universe-soulname-token';
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
      case 'Base Universe': {
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20Base%20Universe%20.bu%20domain%2C%20powered%20by%20%40getmasafi!%20The%20process%20is%20super%20simple%2C%20and%20domains%20are%20free%20on%20testnet%20%F0%9F%A4%A9%C2%A0Grab%20yours%20here%3A%20${tweetContentLink}%20%40UniverseOnBase%20%40BuildOnBase`;
      }
      default: {
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.soul%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=SoulboundIdentity,Masa`;
      }
    }
  }, [company, tweetContentLink]);

  const buttonText = useMemo(() => {
    switch (company) {
      /* case 'Base Universe':
       *   return 'Mint more names'; */
      default: {
        return 'Go to dashboard';
      }
    }
  }, [company]);

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
        {buttonText}
      </button>
    </div>
  );
};
