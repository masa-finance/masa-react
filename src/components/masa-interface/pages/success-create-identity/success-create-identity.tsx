import React, { useCallback, useMemo, useState } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { twitterLogo } from '../../../../assets/twitterLogo';
import { useAsync } from 'react-use';

export const InterfaceSuccessCreateIdentity = (): JSX.Element => {
  const [extension, setExtension] = useState<string>();
  const { masa, isLoading, setForcedPage, soulnames, company } = useMasa();

  useAsync(async () => {
    setExtension(await masa?.contracts.instances.SoulNameContract.extension());
  }, [masa]);

  const handleComplete = useCallback(() => {
    setForcedPage?.(null);
  }, [setForcedPage]);

  const title = useMemo(() => {
    switch (company) {
      case 'Masa':
        return 'You have claimed your .soul domain and your Soulbound Identity has been minted.';
      case 'Celo':
        return 'You have claimed your .celo domain and your Prosperity Passport has been minted.';
      case 'Base':
        return 'You have claimed your .base domain name. Welcome to Base Camp ⛺️';
      case 'Base Universe':
        return 'You have claimed your Base Universe .bu domain name. Welcome to Base Universe.';
      case 'Brozo':
        return 'You have claimed your Brozo .bro domain name. Welcome to the Brozo community!';
      default:
        return 'You have claimed your .soul domain and your Soulbound Identity has been minted.';
    }
  }, [company]);

  const tweetContentLink = useMemo(() => {
    const companyUrlFormatted = company?.toLowerCase().replaceAll(' ', '-');

    switch (company) {
      case 'Masa':
        return 'https://app.masa.finance';
      case 'Celo':
        return soulnames && soulnames.length > 0
          ? `https://raregems.io/celo/celo-domain-names/${soulnames[
              soulnames.length - 1
            ].tokenDetails.tokenId.toString()}`
          : undefined;
      case 'Base':
        return 'https://app.basecamp.global';
      case 'Base Universe':
      case 'Brozo':
        return `https://masa.finance/sbts/${companyUrlFormatted}-soulname-token`;
      default:
        return 'https://app.masa.finance';
    }
  }, [soulnames, company]);

  const baseTwitterUrl = 'https://twitter.com/intent/tweet?text=';

  const twitterLink = useMemo(() => {
    switch (company) {
      case 'Masa':
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.soul%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=SoulboundIdentity,Masa`;
      case 'Celo':
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.celo%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=ProsperityPassport,Celo,Masa`;
      case 'Base':
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.base%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=Basecamp,Base,Masa`;
      case 'Base Universe':
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20Base%20Universe%20.bu%20domain%2C%20powered%20by%20%40getmasafi!%20The%20process%20is%20super%20simple%2C%20and%20domains%20are%20free%20on%20testnet%20%F0%9F%A4%A9%C2%A0Grab%20yours%20here%3A%20${tweetContentLink}%20%40UniverseOnBase%20%40BuildOnBase`;
      case 'Brozo':
        return (
          baseTwitterUrl +
          encodeURIComponent(
            `Just claimed my @BrozoNFT .bro domain, powered by @getmasafi! The process is super simple. Mint your rare .bro domain before it’s taken: ${tweetContentLink} #Brozo #NFT`
          )
        );
      default:
        return `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.soul%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${tweetContentLink}&hashtags=SoulboundIdentity,Masa`;
    }
  }, [company, tweetContentLink]);

  const buttonText = useMemo(() => {
    switch (company) {
      default:
        return 'Go to dashboard';
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
        {`Tweet your ${extension} domain`}
      </a>
      <button className="masa-button" onClick={handleComplete}>
        {buttonText}
      </button>
    </div>
  );
};
