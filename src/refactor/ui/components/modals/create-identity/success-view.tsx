import React from 'react';
import { twitterLogo } from '../../../../../assets/twitterLogo';

interface SuccessViewProps {
  titleText: string;
  twitterText: string | undefined;
  modal: any;
}

const SuccessView = ({
  titleText,
  twitterText,
  modal,
}: SuccessViewProps): JSX.Element => {
  return (
    <section
      id="gtm_hurray_identity_minted"
      className="interface-create-identity"
    >
      <h3 className="title">Hurray! 🎉</h3>
      <p className="subtitle">{titleText}</p>
      <a className="tweet-domain" target="_blank" rel="noreferrer">
        <img src={twitterLogo} style={{ width: 40 }} alt="twitter" />{' '}
        {twitterText}
      </a>
      <button className="masa-button" onClick={() => modal.hide()}>
        Go to dashboard
      </button>
    </section>
  );
};

export default SuccessView;
