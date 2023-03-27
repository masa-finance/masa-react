import React, { useCallback, useMemo } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { twitterLogo } from '../../../../assets/twitterLogo';

export const InterfaceSuccessCreateIdentity = (): JSX.Element => {
  const { isLoading, setForcedPage, soulnames } = useMasa();

  const handleComplete = useCallback(() => {
    setForcedPage?.(null);
  }, [setForcedPage]);

  const rareGemsLink = useMemo(() => {
    const link = soulnames
      ? `https://raregems.io/celo/celo-domain-names/${soulnames[
          soulnames.length - 1
        ].tokenDetails.tokenId.toString()}`
      : undefined;
    return link;
  }, [soulnames]);

  const twitterLink = `https://twitter.com/intent/tweet?text=Just%20claimed%20my%20.celo%20domain!%20The%20process%20is%20super%20simple%2C%20and%205%2B%20character%20domains%20are%20free%20%F0%9F%A4%A9.%20Grab%20yours%20here%3A%20&url=${rareGemsLink}&hashtags=ProsperityPassport,Celo,Masa`;

  if (isLoading) return <MasaLoading />;

  return (
    <div className="interface-create-identity">
      <h3 className="title">Hurray! 🎉</h3>
      <p className="subtitle">
        You have claimed your .celo domain and your Prosperity Passport has been
        minted.
      </p>
      <a className="tweet-domain" href={twitterLink}>
        <img src={twitterLogo} style={{ width: 40 }} alt="twitter" /> Tweet your
        .celo domain
      </a>
      <button className="masa-button" onClick={handleComplete}>
        Go to dashboard
      </button>
    </div>
  );
};
