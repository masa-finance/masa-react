import React from 'react';

interface HurrayViewProps {
  createIdentity: () => void;
}

const HurrayView = ({ createIdentity }: HurrayViewProps): JSX.Element => {
  return (
    <section className="interface-create-identity">
      <h3 className="title">Hurray! 🎉</h3>
      <p className="subtitle">
        Congratulations you already have a Celo Domain Name in your wallet. You
        must now mint a Celo Prosperity Passport.
      </p>
      <button className="masa-button" onClick={createIdentity}>
        Get Prosperity Passport
      </button>
    </section>
  );
};

export default HurrayView;
