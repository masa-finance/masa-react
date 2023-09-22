import React from 'react';
import { NiceModalHandler } from '@ebay/nice-modal-react';
import { twitterLogo } from '../../../../assets/twitterLogo';

interface SuccessViewProps {
  titleText: string;
  twitterText: string | undefined;
  modal: NiceModalHandler<Record<string, unknown>>;
}

const SuccessView = ({
  titleText,
  twitterText,
  modal,
}: SuccessViewProps): JSX.Element => (
  <section
    id="gtm_hurray_identity_minted"
    className="interface-create-identity"
  >
    <h3 className="title">Hurray! 🎉</h3>
    <p className="subtitle">{titleText}</p>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className="tweet-domain" target="_blank" rel="noreferrer">
      <img src={twitterLogo} style={{ width: 40 }} alt="twitter" />{' '}
      {twitterText}
    </a>
    <button type="button" className="masa-button" onClick={() => modal.hide()}>
      Go to dashboard
    </button>
  </section>
);

export default SuccessView;
